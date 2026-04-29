/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query';
import {
  customFetch,
  extractFormData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { ActionFunctionArgs, Form } from 'react-router-dom';
import { formatNumber } from '../../../helperFunc.ts/utilsFunc';
import Title from '../../../components/UI/Title';
import Button from '../../../components/UI/Button';
import axios from 'axios';

const Settings = () => {
  const { data } = useQuery({
    queryKey: ['groupSettings'],
    queryFn: () => fetchData(`/group-settings`),
  });

  return (
    <section>
      <Title title='group settings' />
      <Form method='patch'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <div className='mb-6'>
            <label
              htmlFor='contributionGroupLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              Contribution Group Limit
            </label>
            <input
              type='text'
              id='contributionGroupLimit'
              name='contributionGroupLimit'
              defaultValue={data?.groupSettings?.contributionGroupLimit}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='contributionMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              contribution Member Limit
            </label>
            <input
              type='text'
              id='contributionMemberLimit'
              name='contributionMemberLimit'
              defaultValue={data?.groupSettings?.contributionMemberLimit}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='contributionFixedCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              contribution Fixed Charge
            </label>
            <input
              type='text'
              id='contributionFixedCharge'
              name='name'
              defaultValue={data?.groupSettings?.contributionFixedCharge}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='contributionVariableCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              contribution Variable Charge
            </label>
            <input
              type='text'
              id='contributionVariableCharge'
              name='contributionVariableCharge'
              defaultValue={data?.groupSettings?.contributionVariableCharge}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='contributionAdminLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              contribution Admin Limit
            </label>
            <input
              type='text'
              id='contributionAdminLimit'
              name='name'
              defaultValue={data?.groupSettings?.contributionAdminLimit}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='MinimumContributionWithdrawal'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              Minimum Contribution Withdrawal
            </label>
            <input
              type='text'
              id='MinimumContributionWithdrawal'
              name='MinimumContributionWithdrawal'
              defaultValue={data?.groupSettings?.MinimumContributionWithdrawal}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='basicMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              basic Member Limit
            </label>
            <input
              type='text'
              id='basicMemberLimit'
              name='basicMemberLimit'
              defaultValue={data?.groupSettings?.basicMemberLimit}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <input
            type='text'
            name='id'
            defaultValue={data?.groupSettings?._id}
            hidden
          />

          <div className='mb-6'>
            <label
              htmlFor='basicMemberFee'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              basic Membership Fee
            </label>
            <input
              type='text'
              id='basicMemberFee'
              name='basicMemberFee'
              defaultValue={formatNumber(
                data?.groupSettings?.basicMembershipFee,
              )}
              autoComplete='off'
              className='capitalize'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='premiumMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              premium Member Limit
            </label>
            <input
              type='text'
              id='premiumMemberLimit'
              name='premiumMemberLimit'
              defaultValue={data?.groupSettings?.premiumMemberLimit}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='groupName'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              premium Membership Fee
            </label>
            <input
              type='text'
              id='premiumMembershipFee'
              name='premiumMembershipFee'
              defaultValue={formatNumber(
                data?.groupSettings?.premiumMembershipFee,
              )}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='standardMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              standard Member Limit
            </label>
            <input
              type='text'
              id='standardMemberLimit'
              name='standardMemberLimit'
              defaultValue={formatNumber(
                data?.groupSettings?.standardMemberLimit,
              )}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='standardMembershipFee'
              className={`after:text-red-500 after:content-['*'] after:font-700`}
            >
              standard Membership Fee
            </label>
            <input
              type='text'
              id='standardMembershipFee'
              name='standardMembershipFee'
              defaultValue={formatNumber(
                data?.groupSettings?.standardMembershipFee,
              )}
              autoComplete='off'
              className='capitalize'
            />
          </div>
        </div>
        <Button btnText='save' btnType='submit' />
      </Form>
    </section>
  );
};

export default Settings;

export const loader = async () => {
  queryClient.ensureQueryData({
    queryKey: ['groupSettings'],
    queryFn: () => fetchData(`/group-settings`),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.patch(
      `/group-settings/${formData.id}`,
      formData,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
