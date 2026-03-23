/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, redirect, useParams } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import { customFetch, queryClient } from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { formatNumber } from '../../../helperFunc.ts/utilsFunc';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';

const ViewContributionWithdrawal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { withdrawalId } = useParams();

  const { data } = useQuery({
    queryKey: ['transaction', withdrawalId],
    queryFn: () =>
      fetchData(`/contribution-transactions/admin/${withdrawalId}`),
  });

  // e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  const handleWithdrawalApproval = async () => {
    try {
      setIsLoading(true);
      const dataInput = {
        withdrawalStatus: 'processed',
        withdrawalId: data?.withdrawal?.withdrawalId,
      };
      await customFetch.patch(
        `/contribution-transactions/admin/process`,
        dataInput,
      );

      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      toast.success('Withdrawal has been processed and paid.');
      return redirect('/account/admin/withdrawals/contributions/open');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data?.withdrawal?.withdrawalStatus);

  const status =
    data?.withdrawalStatus !== '' && data?.withdrawalStatus === 'pending'
      ? 'open'
      : 'closed';

  return (
    <section>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn
          btnText='back'
          url={`/account/admin/withdrawals/contributions/${status}`}
        />
      </div>
      {/* Title */}
      <Title title='View withdrawals' />

      <div className='flex justify-center flex-wrap gap-2'>
        {data?.withdrawal?.withdrawalStatus === 'pending' && (
          <>
            <button
              onClick={handleWithdrawalApproval}
              className='bg-green-500 hover:bg-green-400 px-3 py-2 rounded-md capitalize text-slate-200 font-600 cursor-pointer disabled:bg-gray-400 mb-3'
            >
              {isLoading ? 'Processing...' : 'Process withdrawal'}
            </button>

            <button className='bg-green-500 hover:bg-green-400 px-3 py-2 rounded-md capitalize text-slate-200 font-600 cursor-pointer disabled:bg-gray-400 mb-3'>
              Reject withdrawal
            </button>
          </>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Withdrawal Id</span>
          <span className='divInput uppercase'>
            {data?.withdrawal?.withdrawalId}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Contribution</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.contribution}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Withdraw To</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.contributorName}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Initiated By</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.initiatedBy?.surname}{' '}
            {data?.withdrawal?.initiatedBy?.otherNames}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Withdraw To</span>
          <span className='divInput capitalize font-poppins'>
            {formatNumber(data?.withdrawal?.amount)}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Withdraw To</span>
          <span className='divInput capitalize font-poppins'>
            {formatNumber(data?.withdrawal?.withdrawalCharge)}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Account Number</span>
          <span className='divInput capitalize font-poppins'>
            {data?.withdrawal?.accountNumber}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>Account name</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.accountName}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>description</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.description}
          </span>
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <span className='label'>withdrawal date</span>
          <span className='divInput capitalize'>
            {data?.withdrawal?.paidAt.split('T')[0]}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ViewContributionWithdrawal;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { withdrawalId } = params;
  return queryClient.ensureQueryData({
    queryKey: ['transaction', withdrawalId],
    queryFn: () =>
      fetchData(`/contribution-transactions/admin/${withdrawalId}`),
  });
};
