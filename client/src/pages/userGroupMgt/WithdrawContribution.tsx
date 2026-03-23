/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import BackBtn from '../../components/UI/BackBtn';
import Title from '../../components/UI/Title';
import Inputs from '../../components/UI/Inputs';
import { User } from '../../dtos/usersDto';
import Button from '../../components/UI/Button';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import {
  customFetch,
  extractFormData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { fetchContributionMembers } from '../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { IContributionMembers } from '../../dtos/ContributionMembersDto';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FormError from '../../components/UI/FormError';
import { toast } from 'react-toastify';
import { Contribution } from '../../dtos/contributionDto';

const WithdrawContribution = () => {
  const { groupId } = useParams();
  const { user, contribution } = useOutletContext() as {
    user: User;
    contribution: Contribution;
  };
  const error = useActionData();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  // Redirect to main group if logged in user is not an admin.
  useEffect(() => {
    if (!contribution?.admins?.includes(user?._id)) {
      navigate(`/account/manage-group/view/${groupId}`);
    }
  }, [contribution?.admins, groupId, navigate, user?._id]);

  const balance = contribution.effectiveBalance
    ? contribution.effectiveBalance
    : contribution.balance;

  // Get amount typed in by user
  const amt = amount === '' ? 0 : Number(amount);

  // Contribution members fetching
  const url = `/contribution-members/${groupId}?isApproved=${true}&sort=-joinedAt`;

  const { data } = useQuery({
    queryKey: ['contribution-members', 'isApproved', groupId],
    queryFn: () => fetchContributionMembers(url),
  });

  return (
    <section>
      <BackBtn url={`/account/manage-group/view/${groupId}`} />
      <Title title='contribution withdrawal' />

      <div>
        <div className='bg-amber-700 text-slate-50 p-1 m-2 text-[14px] list-disc rounded-md'>
          <p className='text-center'>
            Please note that your withdrawal will be credited your account in
            within 24 hours of placement.
          </p>
        </div>
        <div className='flex flex-wrap gap-3 justify-center'>
          <article className='text-center mb-3 bg-green-600 inline py-2 px-4 rounded-lg'>
            <span className='mr-3 font-poppins'>Balance:</span>
            <span className='font-poppins'>
              &#8358;{formatNumber(balance) || 0}
            </span>
          </article>
          {amount && (
            <article
              className={`text-center mb-3 ${balance > amt ? 'bg-green-600' : 'bg-rose-500'} inline py-2 px-4 rounded-lg`}
            >
              <span className='mr-3 font-poppins'>
                {balance > amt ? 'Effective Balance' : 'Insuffient Balance'}:
              </span>
              <span className='font-poppins'>
                &#8358;{formatNumber(balance - amt) || 0}
              </span>
            </article>
          )}
        </div>
        {/*Form Box */}
        <article className='w-full flex flex-col items-center'>
          <div className='w-full lg:w-3/5'>
            {error && <FormError message={error.message} />}
          </div>
          <Form
            method='post'
            id='contribution-withdrawal'
            className='w-full lg:w-3/5 border-slate-300 border-1 py-2 px-3'
          >
            <input
              type='text'
              name='groupId'
              defaultValue={contribution?._id}
              hidden
            />
            <input
              type='text'
              name='contributionRef'
              defaultValue={contribution?.ref}
              hidden
            />

            <div className='mb-6'>
              <label
                htmlFor='members'
                className={`after:text-red-500 after:content-['*']`}
              >
                withdraw to
              </label>
              <select
                name='memberId'
                id='members'
                className='dark:bg-slate-700 py-2.5 capitalize'
              >
                <option value='' hidden>
                  Select Member
                </option>
                {data?.contributionMembers?.map(
                  (member: IContributionMembers) => {
                    return (
                      <option value={member?.memberId?._id} key={member?._id}>
                        {member?.memberId?.surname}{' '}
                        {member?.memberId?.otherNames.split(' ')[0]}
                      </option>
                    );
                  },
                )}
              </select>
            </div>

            <Inputs
              id='account'
              type='number'
              name='accountNumber'
              label='account number'
              isRequired={true}
            />

            <Inputs
              id='account-name'
              type='text'
              name='accountName'
              label='account name (as on the receiver account)'
              isRequired={true}
            />

            <Inputs
              id='description'
              type='text'
              name='description'
              label='description'
              isRequired={true}
            />

            <div className='mb-6'>
              <label
                htmlFor='amount'
                className={`after:text-red-500 after:content-['*']`}
              >
                amount
              </label>
              <input
                type='number'
                id='amount'
                name='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button btnText='withdraw' btnType='submit' />
          </Form>
        </article>
      </div>
    </section>
  );
};

export default WithdrawContribution;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { groupId } = params;

  const url = `/contribution-members/${groupId}?isApproved=${true}&sort=-joinedAt`;

  return queryClient.ensureQueryData({
    queryKey: ['contribution-members', 'isApproved', groupId],
    queryFn: () => fetchContributionMembers(url),
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.post(
      '/contribution-transactions',
      formData,
    );

    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['open-withdrawal'] });

    toast.success(response?.data?.message);
    return redirect(`/account/manage-group/view/${params.groupId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
