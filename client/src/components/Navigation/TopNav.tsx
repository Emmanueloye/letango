import { FaAngleDown, FaBars, FaHome, FaLock, FaUserAlt } from 'react-icons/fa';
import { dashboardActions } from '../../Actions/DashboardAction';
import { useAppDispatch, useAppSelector } from '../../Actions/store';
import { Link, useNavigate } from 'react-router-dom';
import SiteMode from './SiteMode';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
import { User } from '../../dtos/usersDto';
import { customFetch } from '../../helperFunc.ts/apiRequest';
import { authActions } from '../../Actions/AuthAction';
import { toast } from 'react-toastify';
import axios from 'axios';

const TopNav = ({ user }: { user: User }) => {
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const navigate = useNavigate();

  // Toggle sidebar class names
  const showNavLg = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';

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
    <nav
      className={` ml-0 ${showNavLg} h-[66px] border-b-2 border-primary-500 dark:border-amber-500 transition-all duration-700 ease-in-out px-3 sticky top-0 left-0 bg-gray-200 dark:bg-slate-800 z-6 flex items-center`}
    >
      <div className='container mx-auto py-2 px-4 flex justify-between items-center'>
        {/* Sidebar toggle menu */}
        <FaBars
          className='text-2xl text-primary-500 dark:text-slate-50'
          onClick={() => dispatch(dashboardActions.toggleSidebar())}
        />
        {/* Brand logo */}

        <Link
          title='Back to Home'
          to='/'
          className='flex items-center gap-1 text-2xl text-primary-500 dark:text-slate-50'
        >
          <FaHome className='text-green-500' />

          <span className='font-700 hidden lg:block'>Letango</span>
        </Link>

        {/*=================================================================================
        ========================= Top nav menu ===================================== */}
        <div className='flex items-center gap-4'>
          <SiteMode />
          {/* Dropdown menu */}
          <div className='relative'>
            <div
              className='flex items-center cursor-pointer authbox'
              onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
            >
              <span className='mt-1 dark:text-slate-50 authbox'>
                {`${user.surname}`.charAt(0).toUpperCase()}
                {`${user.otherNames?.split(' ')}`.charAt(0).toUpperCase()}
              </span>
              <FaAngleDown className='mt-1 dark:text-slate-50 authbox' />
            </div>
            {/* Dropdown menu for profile */}
            <ul
              className={`absolute top-[160%]  text-sm w-38 bg-slate-100 dark:bg-slate-800  dark:text-slate-50 p-2 invisible right-0 ${
                isAuthMenuOpen ? 'visible' : 'right-1'
              } transition-all duration-500`}
            >
              <li className='pt-2 mb-5'>
                <Link
                  to='/account/profile'
                  className='flex items-baseline hover:text-amber-600'
                >
                  <FaUserAlt />
                  <span className='ml-1'>Profile</span>
                </Link>
              </li>
              <li className='mb-5'>
                <Link
                  to='/account/profile/change-password'
                  className='flex items-baseline'
                >
                  <FaLock />
                  <span className='ml-1'>Change Password</span>
                </Link>
              </li>
              <li>
                <button
                  className='flex items-baseline cursor-pointer'
                  onClick={logout}
                >
                  <CiLogout />
                  <span className='ml-1'>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
