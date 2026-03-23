import { Form, useNavigation, useParams } from 'react-router-dom';
import Title from '../UI/Title';
import Button from '../UI/Button';
import { useQuery } from '@tanstack/react-query';
import { fetchContribution } from '../../helperFunc.ts/contributionsRequest';
import BackBtn from '../UI/BackBtn';

const EditGroupForm = () => {
  const { groupId } = useParams();
  const { state } = useNavigation();

  const { data } = useQuery({
    queryKey: ['contribution', groupId],
    queryFn: () => fetchContribution(groupId as string),
  });

  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      {/* Back button */}
      <BackBtn url='/account/manage-group' />
      {/* Form title */}
      <Title title='update contribution' />
      <Form
        id='updateContribution'
        method='PATCH'
        encType='multipart/form-data'
      >
        {/* Group name input */}
        <div className='mb-6'>
          <label
            htmlFor='groupName'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Contribution name
          </label>
          <input
            type='text'
            id='groupName'
            name='name'
            defaultValue={data?.contribution?.name}
            autoComplete='off'
            className='capitalize'
          />
        </div>

        {/* Group description input */}
        <div className='mb-6'>
          <label
            htmlFor='description'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            description
          </label>

          <textarea
            name='description'
            id='description'
            defaultValue={data?.contribution?.description}
          ></textarea>
        </div>

        {/* Group logo */}
        <div className='mb-6'>
          <label htmlFor='logo'>Contribution logo</label>

          <input type='file' name='logo' />
        </div>

        <Button
          btnText={
            state === 'submitting' ? 'updating...' : 'Update Contribution'
          }
          btnType='submit'
          disabled={state === 'submitting'}
        />
      </Form>
    </div>
  );
};

export default EditGroupForm;
