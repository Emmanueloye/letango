import { useOutletContext } from 'react-router-dom';
import avater from '../../assets/user-2935527_1280.webp';
import { User } from '../../dtos/usersDto';

const Profile = () => {
  const user = useOutletContext() as User;

  return (
    <article className='w-11/12 bg-gray-100 dark:bg-slate-800 container mx-auto lg:py-2 lg:px-3 shadow-lg'>
      {/* profile image */}
      <div className='flex justify-center lg:mt-8 mb-12 border-b-1 border-green-500'>
        <img
          src={user?.photo || avater}
          alt='User profile image'
          width={100}
          height={100}
          className='rounded-full mb-4 mt-4'
        />
      </div>
      {/* Profile details section */}
      <div className='flex lg:justify-evenly items-center flex-col lg:flex-row mb-3 px-5 lg:divide-x-1 dark:divide-green-500 break-words '>
        <div className='text-center p-2'>
          <span className='block font-600'>Name</span>
          <span className='capitalize'>
            {user.surname} {user.otherNames.split(' ')[0]}
          </span>
        </div>
        <div className='*:block text-center p-2'>
          <span className='font-600'>Email</span>
          <span>{user.email}</span>
        </div>
        <div className='*:block text-center p-2'>
          <span className='font-600'>Account Status</span>
          <span>{user.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </article>
  );
};

export default Profile;
