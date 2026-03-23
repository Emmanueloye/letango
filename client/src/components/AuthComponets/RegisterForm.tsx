import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import logo from '../../assets/logo-no-bg.png';
import Button from '../UI/Button';
import FormError from '../UI/FormError';

const RegisterForm = () => {
  const error = useActionData();
  const { state } = useNavigation();

  return (
    <div>
      <section className='mt-10'>
        <Form
          method='post'
          className='lg:w-1/2 mx-auto border-1 border-primary-500 pb-3 rounded-md'
        >
          {/* Brand logo */}
          <div className='w-full h-20 flex justify-center border-b-2 border-b-amber-500 mb-2 dark:bg-green-200 rounded-md'>
            <img src={logo} alt='Brand logo' className='max-w-full h-full' />
          </div>

          {/* Form error message */}
          {error && <FormError message={error?.message} />}

          <div className='px-3'>
            {/* First name group */}
            <div className='mb-2'>
              <label
                htmlFor='surname'
                className={`after:text-red-500 after:content-['*'] after:font-700`}
              >
                Surname
              </label>
              <input
                type='text'
                id='surname'
                name='surname'
                autoComplete='off'
              />
            </div>
            {/* Other names group */}
            <div className='mb-2'>
              <label
                htmlFor='otherNames'
                className={`after:text-red-500 after:content-['*'] after:font-700`}
              >
                other names
              </label>
              <input
                type='text'
                id='otherNames'
                name='otherNames'
                autoComplete='off'
              />
            </div>
            {/* Email group */}
            <div className='mb-2'>
              <label
                htmlFor='email'
                className={`after:text-red-500 after:content-['*'] after:font-700`}
              >
                email
              </label>
              <input type='email' id='email' name='email' autoComplete='off' />
            </div>
            {/* Password group */}
            <div className='mb-2'>
              <label
                htmlFor='password'
                className={`after:text-red-500 after:content-['*'] after:font-700`}
              >
                password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                autoComplete='off'
              />
            </div>
            {/* Confirmed password group. */}
            <div className='mb-2'>
              <label
                htmlFor='confirmPassword'
                className={`after:text-red-500 after:content-['*'] after:font-700`}
              >
                confirm password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                autoComplete='off'
              />
            </div>
            {/* Register Foot note */}
            <div className='text-sm mb-2 dark:text-slate-50'>
              <span>Already have an account? </span>
              <Link to='/login' className='underline'>
                Login here.
              </Link>
            </div>
            {/* Submit buttton */}
            <Button
              btnText={state === 'submitting' ? 'Registering' : 'Register'}
              btnType='submit'
              disabled={state === 'submitting'}
            />
          </div>
        </Form>
      </section>
    </div>
  );
};

export default RegisterForm;
