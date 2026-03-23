import {
  FaAddressBook,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = ({
  scrollToSection,
}: {
  scrollToSection: (data: string) => void;
}) => {
  return (
    <footer className='border-t-2 border-primary-500 dark:border-amber-600 *:text-primary-500 dark:*:text-gray-300 *:capitalize pb-4 pt-3'>
      <section className='pt-8 lg:grid lg:grid-cols-4 lg:gap-4 lg:items-start '>
        {/*=================================================================================
           ========================= Footer company details==================================== */}
        <article>
          <ul className='*:mb-3'>
            {/* Brand name */}
            <li className='text-lg font-700 capitalize border-b-1 border-primary-500 dark:border-slate-50 lg:border-b-0'>
              Letango Financial Technology
            </li>
            {/* Company's physical address. */}
            <li className='flex items-center text-sm'>
              <span className='mr-2'>
                <FaAddressBook />
              </span>
              <span>Lorem ipsum dolor sit amet consectetur.</span>
            </li>
            {/* Company's email address */}
            <li className='flex items-center text-sm'>
              <span className='mr-2'>
                <MdEmail />
              </span>
              <Link to='mailto:letango@letango.com'>letango@letango.com</Link>
            </li>
            {/* Company's phone number */}
            <li className='flex items-center text-sm'>
              <span className='mr-2'>
                <FaPhone />
              </span>
              <Link to='tel:08111111111'>08111111111</Link>
            </li>
          </ul>
        </article>
        {/*=================================================================================
           ========================= Footer company working hours & policy================== */}
        <article>
          <ul className='*:mb-3'>
            <li className='text-lg font-700 capitalize border-b-1 border-primary-500 dark:border-slate-50 lg:border-b-0'>
              Policies
            </li>
            <li>
              <strong>Work hour:</strong> Mon - Fri - 8am - 6pm
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                User data policy
              </Link>
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                Membership policy
              </Link>
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                User consent policy
              </Link>
            </li>
          </ul>
        </article>

        {/*=================================================================================
           ========================= Footer company customer care platforms================== */}
        <article>
          <ul className='*:mb-3'>
            <li className='text-lg font-700 capitalize border-b-1 border-primary-500 dark:border-slate-50 lg:border-b-0'>
              Customer care
            </li>
            <li>
              <button
                className='flex items-center text-sm'
                onClick={() => scrollToSection('contact')}
              >
                Contact Form
              </button>
            </li>
            <li>
              <Link to='tel:08111111111' className='text-sm'>
                Watsap Only: 08111111111
              </Link>
            </li>
            <li>
              <Link to='mailto:letango@letango.com' className='text-sm'>
                Enquire: letango@letango.com
              </Link>
            </li>
          </ul>
        </article>

        {/*=================================================================================
           ========================= Footer company socials==================================== */}
        <article>
          <ul className='*:mb-3'>
            <li className='text-lg font-700 capitalize border-b-1 border-primary-500 dark:border-slate-50 lg:border-b-0'>
              Socials
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                <span className='mr-2'>
                  <FaFacebook />
                </span>
                <span>Facebook</span>
              </Link>
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                <span className='mr-2'>
                  <FaInstagram />
                </span>
                <span>Instagram</span>
              </Link>
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                <span className='mr-2'>
                  <FaTwitter />
                </span>
                <span>Twitter</span>
              </Link>
            </li>
            <li>
              <Link to='/' className='flex items-center text-sm'>
                <span className='mr-2'>
                  <FaThreads />
                </span>
                <span>Thread</span>
              </Link>
            </li>
          </ul>
        </article>
      </section>

      {/*=================================================================================
           ========================= Footer footnote ================================== */}
      <div className='text-center border-t-2 border-primary-500 dark:border-amber-600'>
        <small className='block mb-2 mt-2'>
          &copy; Copyright {new Date(Date.now()).getFullYear()}
        </small>
        <small className='block'>Development by Emmanuel Oyediran</small>
      </div>
    </footer>
  );
};

export default Footer;
