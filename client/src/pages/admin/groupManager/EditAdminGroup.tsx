/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useParams,
} from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import Button from '../../../components/UI/Button';
import {
  customFetch,
  extractFormData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import FormError from '../../../components/UI/FormError';

const EditAdminGroup = () => {
  const { contributionId } = useParams();
  const error = useActionData();

  const { data } = useQuery({
    queryKey: ['contribution', contributionId],
    queryFn: () => fetchData(`/contributions/admin/${contributionId}`),
  });

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/contributions' />
      </div>
      <Title title='update group' />

      <Form id='updateGroupForm' method='patch'>
        <div>{error && <FormError message={error.message} />}</div>
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupName'>group name</label>
            <input
              type='text'
              id='name'
              name='name'
              defaultValue={data?.contribution?.name}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupType'>group type</label>
            <input
              type='text'
              id='name'
              name='groupType'
              defaultValue={data?.contribution?.groupType}
              autoComplete='off'
              className='capitalize'
              disabled
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='contributionRef'>Contribution Ref</label>
            <input
              type='text'
              id='contributionRef'
              name='ref'
              defaultValue={data?.contribution?.ref}
              autoComplete='off'
              className='uppercase py-1.5'
              disabled
            />
          </div>
          <input
            type='text'
            name='contributionRef'
            defaultValue={data?.contribution?.ref}
            hidden
          />
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='status'>Status</label>
            <select
              name='isActive'
              id='status'
              className='capitalize'
              defaultValue={
                data?.contribution?.isActive ? 'active' : 'inactive'
              }
            >
              <option value='active'>active</option>
              <option value='inactive'>inactive</option>
            </select>
          </div>
        </div>
        <div className='w-full mt-4 lg:mb-0'>
          <label htmlFor='description'>group description</label>
          <textarea
            name='description'
            id='description'
            defaultValue={data?.contribution?.description}
            cols={10}
            rows={5}
            className='resize-y'
          ></textarea>
        </div>
        <div className='mt-3'>
          <Button btnText='save' btnType='submit' />
        </div>
      </Form>
    </section>
  );
};

export default EditAdminGroup;

export const loader = ({ params }: LoaderFunctionArgs) => {
  return queryClient.ensureQueryData({
    queryKey: ['contribution', params.contributionId],
    queryFn: () => fetchData(`/contributions/admin/${params.contributionId}`),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { name, description, isActive, contributionRef } =
    await extractFormData(request);

  const action = isActive === 'active' ? true : false;
  const data = { name, description, isActive: action, contributionRef };

  try {
    await customFetch.patch(`/contributions/admin/${contributionRef}`, data);
    queryClient.invalidateQueries({ queryKey: ['contributions'] });
    queryClient.invalidateQueries({ queryKey: ['contribution'] });
    toast.success('contribution updated successfully.');
    return redirect('/account/admin/contributions');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
