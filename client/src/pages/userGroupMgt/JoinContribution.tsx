/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import {
  ActionFunctionArgs,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';
import { customFetch, extractFormData } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import { capitalized } from '../../helperFunc.ts/utilsFunc';

const JoinContribution = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const query = Object.fromEntries(searchParams);
  const navigate = useNavigate();
  const { state } = useNavigation();
  const submit = useSubmit();
  const data = useActionData();

  const contributionName = params?.groupName?.split('-')?.join(' ');
  const capitalizedName = capitalized(contributionName as string);

  const handleSubmit = () => {
    submit({ ref: query.ref, code: query.code }, { method: 'post' });
  };

  useEffect(() => {
    if (!query.code || !query.ref) {
      navigate('/');
    }
  }, [navigate, query.code, query.ref]);

  return (
    <section className='flex flex-col items-center py-5 mt-4 bg-slate-50 dark:bg-slate-700 dark:text-slate-100'>
      {/* Message box */}
      {data && (
        <ul className='bg-amber-700 text-slate-50 p-1 m-2 text-[14px] rounded-md list-none'>
          {data?.message?.split('. ')?.map((msg: string, index: number) => (
            <li className='ml-4' key={index}>
              {msg}
            </li>
          ))}
        </ul>
      )}
      {/* Main content */}
      <p className='mb-5'>
        Thank you for showing interest in joining
        <span className='capitalize text-green-700 dark:text-green-500 font-600'>
          &nbsp;{capitalizedName}
        </span>
      </p>

      <p className='mb-4'>
        Please, click the join button below to join {capitalizedName}.
      </p>
      <p className='mb-6'>
        You will be required to{' '}
        <Link
          to='/login'
          className='text-amber-700 dark:text-amber-500 font-600 underline'
        >
          logged in
        </Link>{' '}
        or
        <Link
          to='/signup'
          className='text-amber-700 dark:text-amber-500 font-600 underline'
        >
          &nbsp;signup
        </Link>{' '}
        to join a group.
      </p>

      <button
        onClick={handleSubmit}
        disabled={state === 'submitting'}
        className={`bg-green-600 hover:bg-green-400 px-3 py-2 rounded-md capitalize text-slate-100 font-600 cursor-pointer disabled:bg-gray-400`}
      >
        {state === 'submitting' ? 'Joining...' : `Join ${capitalizedName}`}
      </button>
    </section>
  );
};

export default JoinContribution;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.post('/contributions/join', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
