import { useEffect, useState } from 'react';
import Footer from '../components/HomeSections/Footer';
import HomeNav from '../components/Navigation/HomeNav';
import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom';
import { customFetch } from '../helperFunc.ts/apiRequest';
import axios from 'axios';
import { useAppDispatch } from '../Actions/store';
import { authActions } from '../Actions/AuthAction';
import { User } from '../dtos/usersDto';
import Loader from '../components/UI/Loader';

const LandingLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const { state } = useNavigation();
  // dispatch action to know if user is authenticated
  const dispatch = useAppDispatch();

  // Function to scroll to sections
  const [activeSection, setActiveSection] = useState<string>('home');
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch current user
        const response = await customFetch.get('/users/me');
        // dispatch action to set isAuthenticated to true if user is logged in
        dispatch(authActions.isAuthenticated(true));
        setUser(response.data); //come back to check this
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // dispatch action to set isAuthenticated to false if user is not logged in
          dispatch(authActions.isAuthenticated(false));

          return error.response?.data;
        }
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <>
      {/* Navbar */}
      <HomeNav
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />
      {/* Main contents */}
      <main className='min-h-screen'>
        {/* Loader */}
        {state === 'loading' && <Loader />}
        {state === 'submitting' && <Loader />}

        <Outlet context={user} />
      </main>
      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />
      <ScrollRestoration />
    </>
  );
};

export default LandingLayout;
