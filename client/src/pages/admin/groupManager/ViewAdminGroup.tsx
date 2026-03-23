/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import { queryClient } from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';

const ViewAdminGroup = () => {
  const { contributionId } = useParams();

  const { data } = useQuery({
    queryKey: ['contribution', contributionId],
    queryFn: () => fetchData(`/contributions/admin/${contributionId}`),
  });

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/contributions' />
      </div>
      <Title title='view group details' />

      {data?.contribution?.logo && (
        <div className='flex justify-center mb-3'>
          <img
            src={data?.contribution?.logo}
            alt={data?.contribution.name}
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
      )}

      <div className='lg:grid lg:grid-cols-2 gap-4'>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='name'>group name</label>
          <input
            type='text'
            id='name'
            name='name'
            defaultValue={data?.contribution?.name}
            autoComplete='off'
            disabled
            className='capitalize'
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='groupType'>group type</label>
          <input
            type='text'
            id='groupType'
            name='groupType'
            defaultValue={data?.contribution?.groupType}
            autoComplete='off'
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
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='isActive'>Status</label>
          <input
            type='text'
            id='isActive'
            name='ref'
            defaultValue={data?.contribution?.isActive ? 'Active' : 'Inactive'}
            autoComplete='off'
            className='py-1.5'
            disabled
          />
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
          disabled
        ></textarea>
      </div>
    </section>
  );
};

export default ViewAdminGroup;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return queryClient.ensureQueryData({
    queryKey: ['contribution', params.contributionId],
    queryFn: () => fetchData(`/contributions/admin/${params.contributionId}`),
  });
};
