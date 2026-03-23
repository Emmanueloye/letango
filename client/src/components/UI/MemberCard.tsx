import {
  FaCalendarAlt,
  FaCheckCircle,
  FaSave,
  FaShieldAlt,
  FaTimesCircle,
  FaUserCheck,
} from 'react-icons/fa';
import userImg from '../../assets/userjpg.jpg';
import { IContributionMembers } from '../../dtos/ContributionMembersDto';
import { formatDate } from '../../helperFunc.ts/utilsFunc';
import { useOutletContext, useSubmit } from 'react-router-dom';
import { User } from '../../dtos/usersDto';
import { HiUserGroup } from 'react-icons/hi';

const MemberCard = ({ member }: { member: IContributionMembers }) => {
  const { user } = useOutletContext() as { user: User };
  const submit = useSubmit();

  const pathEnd = window.location.pathname.split('/').slice(-1)[0];

  const isAdmin = member?.contributionId.admins.includes(user?._id);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // confirm before changing role, especially when changing to owner.
    let message = `Are you sure you want to change this member role to ${e.currentTarget.value}?`;

    if (member?.role === 'admin' && e.currentTarget.value === 'member') {
      message = `Are you sure you want to change this member role from ${member?.role} to ${e.currentTarget.value}? This action will remove all admin rights from the member.`;
    }

    if (member.role === 'member' && e.currentTarget.value === 'admin') {
      message = `Are you sure you want to give ownership/admin right to this member? The member will have previledge access to the contribution.`;
    }

    const proceed = window.confirm(message);
    if (proceed) {
      submit(
        {
          id: member._id,
          memberId: member?.memberId?._id,
          role: e.currentTarget.value,
        },
        { method: 'patch' },
      );
    }
  };

  const handleApprovalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proceed = window.confirm(
      `Are you sure you want to ${e.currentTarget.value === 'true' ? 'admit' : 'unadmit'} this member?`,
    );
    if (proceed) {
      submit(
        {
          id: member._id,
          memberId: member?.memberId?._id,
          isApproved: e.currentTarget.value,
        },
        { method: 'patch' },
      );
    }
  };

  return (
    <article className='card bg-gray-300/40 dark:bg-slate-600 p-3 rounded-md flex flex-col gap-3'>
      {/* Card header */}
      <div className='card-header flex justify-between lg:justify-center lg:flex-col items-center flex-wrap gap-3 border-b-1 border-gray-400 pb-3 rounded-md'>
        <div className='main flex flex-wrap items-center gap-3'>
          <img
            src={member?.memberId?.photo || userImg}
            alt='users'
            width={50}
            height={50}
            className='rounded-full border-1 border-gray-400 object-cover'
          />
          <div className='flex flex-col items-center'>
            <p className='font-600 capitalize'>
              {member?.memberId?.surname}{' '}
              {member?.memberId?.otherNames.split(' ')[0]}
            </p>
            {isAdmin && (
              <p className='text-[12px] lowercase break-all'>
                {member?.memberId?.email}
              </p>
            )}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 ${member?.isApproved ? 'bg-green-700' : 'bg-amber-600'} py-1 px-2 rounded-md text-[11px]`}
        >
          {member?.isApproved ? (
            <FaCheckCircle className='text-slate-50' />
          ) : (
            <FaTimesCircle className='text-slate-50' />
          )}
          <span className='text-slate-100'>
            {member?.isApproved ? 'Admitted' : 'Unadmitted'}
          </span>
        </div>
      </div>
      {/* section one */}
      <div className='flex items-center flex-wrap gap-3 border-b-1 border-gray-400 p-2 rounded-md text-sm'>
        <FaCalendarAlt className='text-sm' />
        <span>Joined </span>
        <span className='font-poppins font-600'>
          {formatDate(new Date(member?.joinedAt))}
        </span>
      </div>
      {/* section two */}
      {member?.isApproved && (
        <div className='flex items-center flex-wrap gap-3 border-b-1 border-gray-400 p-2 rounded-md text-sm'>
          <FaUserCheck className='text-sm' />
          <span>Admitted by</span>
          {!member?.approvedBy && (
            <span className='font-600 uppercase'>system</span>
          )}
          {member?.approvedBy && member?.role !== 'owner' && (
            <span className='font-600 capitalize'>
              {member?.approvedBy?.surname}{' '}
              {member?.approvedBy?.otherNames?.charAt(0)}
            </span>
          )}
        </div>
      )}
      {/* section three */}
      <div className='flex items-center flex-wrap gap-3 p-2 rounded-md text-sm border-b-1 border-gray-400'>
        <FaShieldAlt />
        <span>Role</span>
        <span className='font-600 capitalize'>{member?.role}</span>
      </div>

      {/* role last updated */}
      {member?.roleUpdatedBy && isAdmin && (
        <div className='flex items-center flex-wrap gap-3 border-b-1 border-gray-400 p-2 rounded-md text-sm'>
          <FaSave className='text-sm' />
          <span>Role updated by </span>
          <span className='font-poppins font-600 capitalize'>
            {member?.roleUpdatedBy?.surname}{' '}
            {member?.roleUpdatedBy?.otherNames?.charAt(0)}
          </span>
        </div>
      )}

      {/*Action -  Admin section - set membership and admin */}
      {isAdmin && member?.isApproved && (
        <div className='flex items-center flex-wrap gap-3 p-2 rounded-md text-sm '>
          <HiUserGroup className='text-sm' />
          <span className='capitalize'>action</span>
          <select
            defaultValue={member?.role}
            name='role'
            id='role'
            className='font-600 w-full md:w-2/4 capitalize'
            onChange={handleRoleChange}
          >
            <option value='member'>Member</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
      )}
      {/*Action - Approve pending members */}
      {isAdmin && (
        <div className='flex items-center flex-wrap gap-3 p-2 rounded-md text-sm'>
          <FaCheckCircle className='text-sm' />
          <span>{pathEnd === 'unadmitted' ? 'Action' : 'Approval'}</span>
          <select
            value={member?.isApproved ? 'true' : 'false'}
            name='isApproved'
            id='isApproved'
            className='font-600 w-full md:w-[55%] capitalize'
            onChange={handleApprovalChange}
          >
            <option value='false'>unapproved</option>
            <option value='true'>approved</option>
          </select>
        </div>
      )}
    </article>
  );
};

export default MemberCard;
