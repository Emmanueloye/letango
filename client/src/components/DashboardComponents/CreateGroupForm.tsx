import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import Button from '../UI/Button';
import Title from '../UI/Title';
import FormError from '../UI/FormError';
import BackBtn from '../UI/BackBtn';

const CreateGroupForm = () => {
  const { state } = useNavigation();

  const error = useActionData();
  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      <BackBtn url='/account/manage-group' />
      {/* Form title */}
      <Title title='new contribution' />

      <Form method='post' id='contribution'>
        {error && <FormError message={error?.message} />}
        {/* Group name input */}
        <div className='mb-6'>
          <label
            htmlFor='contribution'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            group name
          </label>
          <input type='text' id='contribution' name='name' autoComplete='off' />
        </div>

        {/* Group description input */}
        <div className='mb-6'>
          <label
            htmlFor='description'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Group description
          </label>

          <textarea name='description' id='description'></textarea>
        </div>

        <p className='text-sm mb-3'>
          By creating this peer contribution group, you agree to abide by the{' '}
          <span className='underline text-amber-300'>
            <Link to='/'> terms and conditions </Link>
          </span>
          of this platform
        </p>

        {/* Group logo */}
        {/* <div className='mb-6'>
          <label
            htmlFor='logo'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Group logo
          </label>

          <input type='file' />
        </div> */}

        <Button
          btnText={
            state === 'submitting' ? 'Creating...' : 'Create Contribution'
          }
          btnType='submit'
          disabled={state === 'submitting'}
        />
      </Form>
    </div>
  );
};

export default CreateGroupForm;
