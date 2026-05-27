import { useRouteLoaderData } from 'react-router-dom';
import errorImage from '../assets/404.png';

const NotFound = () => {
  const user = useRouteLoaderData('user');
  console.log(user);

  return (
    <section>
      <main
        className={`dark:bg-slate-700 min-h-screen ml-0 transition-all duration-700 ease-in-out py-6 lg:px-8 px-2 dark:text-slate-50 flex justify-center items-center text-2xl`}
      >
        <div className='flex flex-col items-center'>
          <img
            src={errorImage}
            alt='error image'
            className='rounded-full'
            width={100}
            height={100}
          />
          <p className='font-700 font-poppins text-3xl mt-2'>404</p>
          <p className='capitalize text-base mt-2'>
            Oops {user?.user?.otherNames?.split(' ')[0]} !
          </p>
          <p className='text-base mt-2'>
            The page you are looking for does not exist.
          </p>
        </div>
      </main>
    </section>
  );
};

export default NotFound;
