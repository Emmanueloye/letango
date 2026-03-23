/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import { queryClient } from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';

const ViewUser = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => fetchData(`/users/get-user/${params.userId}`),
  });

  const user = data?.user;

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/user-manager' />
      </div>
      <Title title='view user details' />

      <div className='lg:grid lg:grid-cols-2 gap-4'>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='surname'>surname</label>
          <input
            id='surname'
            name='surname'
            autoComplete='off'
            className='capitalize'
            disabled
            defaultValue={user?.surname}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='otherNames'>other names</label>
          <input
            id='otherNames'
            name='otherNames'
            autoComplete='off'
            className='capitalize'
            disabled
            defaultValue={user?.otherNames}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='email'>email</label>
          <input
            id='email'
            name='email'
            autoComplete='off'
            disabled
            defaultValue={user?.email}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='phone'>phone</label>
          <input
            id='phone'
            name='phone'
            autoComplete='off'
            disabled
            defaultValue={user?.phone}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='userStatus'>user status</label>
          <input
            id='userStatus'
            name='userStatus'
            autoComplete='off'
            disabled
            className='capitalize'
            value={user?.isActive ? 'active' : 'inactive'}
          />
        </div>
      </div>
    </section>
  );
};

export default ViewUser;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const url = `/users/get-user/${params.userId}`;

  return queryClient.ensureQueryData({
    queryKey: ['user', params.userId],
    queryFn: () => fetchData(url),
  });
};
