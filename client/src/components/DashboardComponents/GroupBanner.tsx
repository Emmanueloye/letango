import { useState } from 'react';
import LinkBtn from '../UI/LinkBtn';
import { Contribution } from '../../dtos/contributionDto';
import { useQuery } from '@tanstack/react-query';
import { fetchContributionMembers } from '../../helperFunc.ts/contributionsRequest';
import { useParams } from 'react-router-dom';
import { FaExclamation, FaUserAlt } from 'react-icons/fa';

const GroupBanner = ({ contribution }: { contribution: Contribution }) => {
  const [isShow, setIsShow] = useState(false);
  const params = useParams();

  // Fetch initial membership data
  const admittedURL = `/contribution-members/${params.groupId}?isApproved=${true}&sort=-joinedAt`;

  const unadmittedURL = `/contribution-members/${params.groupId}?isApproved=${false}&sort=-joinedAt`;

  const { data: admitted } = useQuery({
    queryKey: ['contribution-members', params.groupId, false],
    queryFn: () => fetchContributionMembers(admittedURL),
  });

  const { data: unadmitted } = useQuery({
    queryKey: ['contribution-members', params.groupId, true],
    queryFn: () => fetchContributionMembers(unadmittedURL),
  });

  return (
    <>
      <div className=' bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap text-lg p-2 border-b-2 border-green-600'>
        <div className='flex flex-wrap items-center gap-2'>
          {contribution?.logo && (
            <img
              className='rounded-full object-cover'
              src={contribution?.logo}
              alt={`${contribution?.name} logo`}
              width={60}
              height={60}
            />
          )}
          <div>
            <h1 className='font-600 capitalize'>{contribution?.name}</h1>
            <div className='flex justify-between flex-wrap gap-4 text-sm mt-3'>
              {/* Members icon */}
              <div className='flex items-center gap-2 capitalize mr-2'>
                <span className='bg-green-600 rounded-full p-1'>
                  <FaUserAlt className='text-slate-100 text-[11px]' />
                </span>
                <span className='mr-1'>member</span>
                <span>{admitted?.noHits}</span>
              </div>
              {/* Unadmitted icon */}
              <div className='flex items-center gap-2 capitalize mr-2'>
                <span className='bg-red-600 rounded-full p-1'>
                  <FaExclamation className='text-slate-100  text-[11px]' />
                </span>
                <span className='mr-1'>unadmitted</span>
                <span>{unadmitted?.noHits}</span>
              </div>
            </div>
          </div>
        </div>
        <span
          className='bg-green-600 p-1 px-6 rounded-2xl text-sm text-green-100 capitalize cursor-pointer'
          onClick={() => setIsShow(!isShow)}
        >
          {isShow ? 'hide' : 'show'}
        </span>
      </div>
      <div
        className={`text-sm bg-gray-100 dark:bg-slate-800 p-2  ${
          isShow ? 'pt-4 block' : 'hidden'
        }`}
      >
        <div className='mb-2'>
          <span className='font-600 capitalize'>group type: </span>
          <span className='capitalize'>
            {contribution?.groupType || 'contribution'}
          </span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group description: </span>
          <span className='text-justify'>{contribution?.description}</span>
        </div>
        <div className='flex gap-2'>
          <LinkBtn
            btnText='manage group rules'
            url={`/account/manage-group/view/${contribution?.ref}/manage-rules`}
          />
          <LinkBtn
            btnText='view group rules'
            url={`/account/manage-group/view/${contribution?.ref}/view-rules`}
          />
        </div>
      </div>
    </>
  );
};

export default GroupBanner;
