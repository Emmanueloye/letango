import { useState } from 'react';
import { customFetch, queryClient } from '../../helperFunc.ts/apiRequest';
import { toast } from 'react-toastify';
import axios from 'axios';
import FormError from './FormError';

type ActionBoxProps = {
  setOpen: (open: boolean) => void;
  title: string;
  name: string;
  btnText: string[];
  endpoint: string;
  successMessage: string;
  defaultPayload?: Record<string, unknown>;
  invalidateKeys?: string[][];
  onSuccess?: () => void;
};

const ActionBox = ({
  setOpen,
  title,
  name,
  btnText,
  endpoint,
  successMessage,
  defaultPayload = {},
  invalidateKeys = [],
  onSuccess,
}: ActionBoxProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const data = { ...payload, ...defaultPayload };

    // formData.append('withdrawalStatus', 'reject');
    // formData.append('withdrawalId', withdrawalId);
    // const data = Object.fromEntries(formData.entries());

    try {
      setIsLoading(true);

      await customFetch.patch(endpoint, data);

      invalidateKeys.forEach((key: string[]) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );

      // queryClient.invalidateQueries({ queryKey: ['transaction'] });
      // queryClient.invalidateQueries({ queryKey: ['open-withdrawal'] });

      toast.success(successMessage);
      setOpen(false);
      onSuccess?.();
      // navigate('/account/admin/withdrawals/contributions/open');
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
      id='action'
      popover='manual'
      className='popover bg-white/20 p-4 rounded-md shadow-lg w-full h-full relative z-40'
    >
      <div className='absolute left-1/2 top-[340px] -translate-x-1/2 lg:-translate-x-1/3 -translate-y-1/2 w-1/2'>
        <form
          onSubmit={handleSubmit}
          className='dark:bg-slate-600 bg-slate-50 p-3 w-full flex flex-col'
        >
          {error && <FormError message={error} />}
          <div className='mb-2 divInput'>{title}</div>
          <div className='mb-2'>
            <textarea name={name} />
          </div>
          <div className='flex mb-2'>
            <button
              className='text-center bg-green-500 w-full rounded-md p-1 text-slate-50 mr-2 cursor-pointer capitalize disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              {isLoading ? btnText[0] : btnText[1]}
            </button>
            <button
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className='text-center bg-slate-500 w-full rounded-md p-1 text-slate-50 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed capitalize'
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionBox;
