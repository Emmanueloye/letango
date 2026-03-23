import { Link } from 'react-router-dom';
import phoneImage from '../../assets/mobile-noBg.png';

const HeroBox = () => {
  return (
    <div className='dark:bg-slate-800' id='home'>
      <section className='lg:pt-12'>
        {/*=================================================================================
        ========================= Hero section titles====================================== */}
        <article>
          <h1 className='capitalize font-900 text-3xl lg:text-5xl text-primary-500 dark:text-slate-50 text-center'>
            join letango today
          </h1>
          <h3 className='capitalize text-sm md:text-2xl text-primary-500 dark:text-slate-50 text-center mt-8'>
            We are better <span className='uppercase font-900'>together</span>.
          </h3>
        </article>
        {/*=================================================================================
        ========================= Hero section image====================================== */}
        <div className='w-full flex justify-center items-center '>
          <img
            src={phoneImage}
            alt='Mobile phone with letango core solutions'
            className='max-w-full dark:z-20'
          />
        </div>
      </section>
      {/*=================================================================================
        ========================= Hero section call to action ==============================*/}
      <div className='relative'>
        <div className='w-full bg-green-500 dark:bg-slate-700 h-40 -mt-25 lg:-mt-30 border-t-2 border-orange-400 relative -z-10 dark:-z-0'></div>
        <Link
          to='/signup'
          className='absolute -bottom-3 text-sm sm:text-base sm:bottom-0 left-1/2 -translate-1/2 bg-primary-500 dark:bg-white dark:text-primary-500 text-white font-600 px-8 py-2 rounded-2xl shadow-md'
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default HeroBox;
