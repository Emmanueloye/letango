import { useState } from 'react';
import { customFetch, queryClient } from '../../helperFunc.ts/apiRequest';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormError from './FormError';

const RejectBox = ({
  setOpen,
  withdrawalId,
}: {
  setOpen: (data: boolean) => void;
  withdrawalId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log(withdrawalId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('withdrawalStatus', 'reject');
    formData.append('withdrawalId', withdrawalId);
    const data = Object.fromEntries(formData.entries());

    try {
      setIsLoading(true);

      await customFetch.patch(`/contribution-transactions/admin/process`, data);

      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: ['open-withdrawal'] });
      toast.success('Withdrawal has been rejected.');
      setOpen(false);
      navigate('/account/admin/withdrawals/contributions/open');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // toast.error(error?.response?.data?.message);
        setError(error?.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      id='rejectBox'
      popover='manual'
      className='popover bg-white/20 p-4 rounded-md shadow-lg w-full h-full relative z-40'
    >
      <div className='absolute left-1/2 top-[340px] -translate-x-1/2 lg:-translate-x-1/3 -translate-y-1/2 w-1/2'>
        <form
          onSubmit={handleSubmit}
          className='dark:bg-slate-600 bg-slate-50 p-3 w-full flex flex-col'
        >
          {error && <FormError message={error} />}
          <div className='mb-2 divInput'>Reject</div>
          <div className='mb-2'>
            <textarea name='rejectionReason' />
          </div>
          <div className='flex mb-2'>
            <button className='text-center bg-green-500 w-full rounded-md p-1 text-slate-50 mr-2 cursor-pointer'>
              {isLoading ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className='text-center bg-slate-500 w-full rounded-md p-1 text-slate-50 cursor-pointer'
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectBox;
