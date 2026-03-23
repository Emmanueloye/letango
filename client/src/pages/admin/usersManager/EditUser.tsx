/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
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
import axios from 'axios';
import { toast } from 'react-toastify';

const EditUser = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => fetchData(`/users/get-user/${params.userId}`),
  });

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/user-manager' />
      </div>
      <Title title='update users' />

      <Form id='updateUserForm' method='patch'>
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='surname'>surname</label>
            <input
              id='surname'
              name='surname'
              defaultValue={data?.user?.surname}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='otherNames'>other names</label>
            <input
              id='otherNames'
              name='otherNames'
              defaultValue={data?.user?.otherNames}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='email'>email</label>
            <input
              id='email'
              name='email'
              defaultValue={data?.user?.email}
              autoComplete='off'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='phone'>phone</label>
            <input
              id='phone'
              name='phone'
              defaultValue={data?.user?.phone}
              autoComplete='off'
            />
          </div>

          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='userStatus'>user status</label>
            <select
              id='userStatus'
              name='isActive'
              defaultValue={data?.user?.isActive ? 'active' : 'inactive'}
              className='capitalize'
            >
              <option value='active'>active</option>
              <option value='inactive'>inactive</option>
            </select>
          </div>
        </div>
        <div className='mt-3'>
          <Button btnText='save' btnType='submit' />
        </div>
      </Form>
    </section>
  );
};

export default EditUser;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const url = `/users/get-user/${params.userId}`;

  return queryClient.ensureQueryData({
    queryKey: ['user', params.userId],
    queryFn: () => fetchData(url),
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { surname, otherNames, phone, isActive } =
    await extractFormData(request);

  const status = isActive === 'active' ? true : false;

  const data = { surname, otherNames, phone, isActive: status };

  try {
    await customFetch.patch(`/users/${params.userId}`, data);
    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.success('User updated successfully.');
    return redirect('/account/admin/user-manager');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // handle Axios error here if needed
      toast.error(error?.response?.data?.message);
      return error?.response?.data;
    }
  }

  return null;
};
