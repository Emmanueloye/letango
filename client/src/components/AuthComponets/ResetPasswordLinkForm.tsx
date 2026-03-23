import { Form, useActionData, useNavigation } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';
import FormError from '../UI/FormError';

const ResetPasswordLinkForm = () => {
  const data = useActionData();
  const { state } = useNavigation();
  return (
    <>
      <section className='mt-30'>
        <Form
          method='post'
          className='lg:w-1/2 mx-auto border-1 border-primary-500 pb-3 rounded-md'
        >
          <div className='w-full h-20 flex justify-center border-b-2 border-b-amber-500 mb-2 dark:bg-green-200 rounded-md'>
            <img src={logo} alt='Brand logo' className='max-w-full h-full' />
          </div>

          {/* Form Error */}
          {data && !data?.success && <FormError message={data?.message} />}
          {data && data?.success && <FormError message={data?.message} />}
          {/* Main form */}
          <div className='px-3'>
            {/* Email group */}
            <div className='mb-2'>
              <label htmlFor='email'>email</label>
              <input type='email' id='email' name='email' autoComplete='off' />
            </div>

            {/* Login submit button. */}
            <Button
              btnText={
                state === 'submitting'
                  ? 'Sending reset link'
                  : 'reset password link'
              }
              btnType='submit'
              disabled={state === 'submitting'}
            />
          </div>
        </Form>
      </section>
    </>
  );
};

export default ResetPasswordLinkForm;
