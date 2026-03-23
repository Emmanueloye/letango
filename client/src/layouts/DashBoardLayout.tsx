/* eslint-disable react-refresh/only-export-components */
import {
  Outlet,
  redirect,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import SideBar from '../components/Navigation/SideBar';
import TopNav from '../components/Navigation/TopNav';
import { useAppSelector } from '../Actions/store';
import { customFetch } from '../helperFunc.ts/apiRequest';
import axios from 'axios';
import Loader from '../components/UI/Loader';

const DashBoardLayout = () => {
  const data = useLoaderData();

  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const { state } = useNavigation();

  const adjustMain = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';
  return (
    <>
      <SideBar user={data?.user} />
      <TopNav user={data?.user} />
      <main
        className={`dark:bg-slate-700 min-h-screen ml-0 ${adjustMain} transition-all duration-700 ease-in-out py-6 lg:px-8 px-2 dark:text-slate-50`}
      >
        {/* <Loader /> */}
        {/* Loader set up */}
        {state === 'loading' && <Loader />}
        {state === 'submitting' && <Loader />}

        <Outlet context={data.user} />
      </main>
      <ScrollRestoration />
    </>
  );
};

export default DashBoardLayout;

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // if no user found, redirect to login page
      return redirect('/login');
    }
  }
};
