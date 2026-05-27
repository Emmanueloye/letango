import { useRouteError, useRouteLoaderData } from 'react-router-dom';
import SideBar from '../components/Navigation/SideBar';
import TopNav from '../components/Navigation/TopNav';
import { useAppSelector } from '../Actions/store';
import error403Image from '../assets/403.png';
import error404Image from '../assets/404.png';
import error505Image from '../assets/505.png';

const Error = () => {
  const user = useRouteLoaderData('user');

  type ErrorType = {
    status?: number;
    data: {
      success?: boolean;
      statusCode?: number;
      status?: string;
      message?: string;
    };
  };

  const error = useRouteError() as ErrorType;

  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const adjustMain = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';

  let errorImage;

  if (error?.data?.statusCode === 403) {
    errorImage = error403Image;
  } else if (error?.data?.statusCode === 404) {
    errorImage = error404Image;
  } else if (error?.data?.statusCode === 401) {
    errorImage = error403Image;
  } else {
    errorImage = error505Image;
  }

  return (
    <>
      <SideBar user={user.user} />
      <TopNav user={user.user} />
      <main
        className={`dark:bg-slate-700 min-h-screen ml-0 ${adjustMain} transition-all duration-700 ease-in-out py-6 lg:px-8 px-2 dark:text-slate-50 flex justify-center items-center text-2xl`}
      >
        <div className='flex flex-col items-center'>
          <img
            src={errorImage}
            alt='error image'
            className='rounded-full'
            width={100}
            height={100}
          />
          <p className='font-700 font-poppins text-3xl mt-2'>
            {error?.data?.statusCode}
          </p>
          <p className='capitalize text-base mt-2'>
            Oops {user?.user?.otherNames?.split(' ')[0]} !
          </p>
          <p className='text-base'>{error?.data?.message}</p>
        </div>
      </main>
    </>
  );
};

export default Error;
