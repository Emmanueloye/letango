import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import coloredLogo from '../../assets/logo-no-bg.png';
import whiteLogo from '../../assets/whiteLogo-nobg.png';

const SiteMode = ({ setLogo }: { setLogo?: (image: string) => void }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);

  // Switing site mode
  const switchMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Set darkmode in local storage and also set html tag to dark mode for tailwindcss to use for dark utilities.
  useEffect(() => {
    if (isDarkMode) {
      localStorage.setItem('darkMode', 'true');
      window.document.documentElement.classList.add('dark');
    } else if (isDarkMode === false) {
      localStorage.setItem('darkMode', 'false');
      window.document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(localStorage.getItem('darkMode') === 'true');
    }
  }, [isDarkMode]);

  // Function is setting brand logo depending on whether we are in light or dark mode.
  useEffect(() => {
    if (isDarkMode && setLogo) {
      setLogo(whiteLogo);
    }
    if (!isDarkMode && setLogo) {
      setLogo(coloredLogo);
    }
  }, [isDarkMode, setLogo]);

  return (
    <div
      className='text-primary-500 dark:text-slate-50 cursor-pointer text-2xl'
      onClick={switchMode}
    >
      {isDarkMode ? <FaSun title='Light Mode' /> : <FaMoon title='Dark Mode' />}
    </div>
  );
};

export default SiteMode;
