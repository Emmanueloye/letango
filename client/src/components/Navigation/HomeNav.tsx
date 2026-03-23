import { FaBars } from 'react-icons/fa';
// import logo from '../../assets/logo-no-bg.png';
// import whiteLogo from '../../assets/whiteLogo-nobg.png';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import SiteMode from './SiteMode';
import { useAppDispatch, useAppSelector } from '../../Actions/store';
import { customFetch } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import { authActions } from '../../Actions/AuthAction';
import { toast } from 'react-toastify';

const HomeNav = ({
  scrollToSection,
  activeSection,
}: {
  scrollToSection: (data: string) => void;
  activeSection: string;
}) => {
  // State to manage mobile menue toggle.
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Refs to manage the height of mobile menu drop down.
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function setting the height of the container div to the height of the inner div which holds the mobile menus.
  useEffect(() => {
    if (isOpen) {
      const height = boxRef.current?.getBoundingClientRect().height;

      containerRef.current!.style.height = `${height}px`;
    } else {
      containerRef.current!.style.height = '0px';
    }
  }, [isOpen]);

  // Logout function
  const logout = async () => {
    try {
      const response = await customFetch.delete('/auth/logout');
      dispatch(authActions.isAuthenticated(false));
      toast.success('You are now logged out. Hope to see you back soon!');
      navigate('/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data.err;
      }
    }
  };

  return (
    <header className='lg:border-b-3 lg:border-primary-500 dark:lg:border-amber-600 bg-white dark:bg-slate-800 sticky top-0 left-0 z-50'>
      <nav className='container mx-auto py-2 px-3 lg:flex lg:justify-between lg:items-center'>
        {/*=============================================================================
        ========================= Brand and mobile menu toggle========================== */}
        <div className='flex justify-between items-center border-b-3 border-primary-500 dark:border-amber-600 lg:border-b-0'>
          <Link to='/'>
            <img src={logo} alt='Letango brand logo' width={150} height={150} />
          </Link>
          <FaBars
            className='text-2xl text-primary-500 cursor-pointer lg:hidden dark:text-slate-50'
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {/*=================================================================================
        ========================= desktop nav menu========================================== */}
        <div
          ref={containerRef}
          className='h-0 lg:hfull overflow-hidden lg:overflow-visible bg-white z-30 transition-all duration-500 flex items-center'
        >
          {/*=================================================================================
        ========================= Main navigation menu========================================== */}
          <div
            ref={boxRef}
            className='lg:flex lg:justify-between lg:gap-4 lg:items-center w-full dark:bg-slate-800'
          >
            <ul className='*:text-primary-500 font-500 *:mb-2 *:lg:mb-0 *:lg:pl-8 *:border-b-1 *:lg:border-b-0 lg:flex lg:justify-between *:text-[15px]'>
              <li className='pt-2 lg:pt-0  dark:text-slate-50'>
                <Link
                  to='/'
                  className={activeSection === 'home' ? 'font-700' : ''}
                  onClick={() => scrollToSection('home')}
                >
                  Home
                </Link>
              </li>
              <li className=' dark:text-slate-50'>
                <button
                  className={activeSection === 'solutions' ? 'font-700' : ''}
                  onClick={() => scrollToSection('solutions')}
                >
                  Solutions
                </button>
              </li>
              <li className=' dark:text-slate-50'>
                <button
                  className={activeSection === 'about-us' ? 'font-700' : ''}
                  onClick={() => scrollToSection('about-us')}
                >
                  About us
                </button>
              </li>
              <li className=' dark:text-slate-50'>
                <button
                  className={activeSection === 'contact' ? 'font-700' : ''}
                  onClick={() => scrollToSection('contact')}
                >
                  Contact
                </button>
              </li>
              {isAuthenticated && (
                <li className=' dark:text-slate-50'>
                  <NavLink
                    to='/account'
                    className={({ isActive }) => (isActive ? 'font-700' : '')}
                  >
                    Account
                  </NavLink>
                </li>
              )}
            </ul>
            {/*=================================================================================
        ======================== Auth and call to action links================================= */}

            <div className='inline-block lg:flex flex-col lg:flex-row lg:items-center *:mb-2 *:lg:mb-0 *:mt-2 *:lg:mt-0 *:lg:mr-2'>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={logout}
                    className='border border-primary-500 font-500 text-primary-500 dark:text-slate-50 dark:border-slate-50 px-3 py-1 rounded-md hover:bg-primary-500 hover:text-white lg:mr-3 cursor-pointer'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <Link
                      to='/signup'
                      className='bg-green-600 hover:bg-green-400 px-3 py-1 rounded-md text-white font-600'
                    >
                      Sign up
                    </Link>
                  </div>
                  <div>
                    <Link
                      to='/login'
                      className='border border-primary-500 font-500 text-primary-500 dark:text-slate-50 dark:border-slate-50 px-3 py-1 rounded-md hover:bg-primary-500 hover:text-white lg:mr-3'
                    >
                      Login in
                    </Link>
                  </div>
                </>
              )}

              <SiteMode setLogo={setLogo} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HomeNav;
