/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import BackBtn from '../../components/UI/BackBtn';
import Title from '../../components/UI/Title';
import Inputs from '../../components/UI/Inputs';
import Button from '../../components/UI/Button';
import { User } from '../../dtos/usersDto';
import {
  customFetch,
  extractFormData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import FormError from '../../components/UI/FormError';
import { Contribution } from '../../dtos/contributionDto';

const ContributeForm = () => {
  const { groupId } = useParams();
  const { user, contribution } = useOutletContext() as {
    user: User;
    contribution: Contribution;
  };
  const { state } = useNavigation();
  const error = useActionData();

  return (
    <div>
      {/* Back button */}
      <BackBtn url={`/account/manage-group/view/${groupId}`} />
      {/* Form title */}
      <Title title={`Contribute to ${contribution?.name}`} />

      <Form
        id='contribute'
        method='post'
        className='lg:w-3/5 lg:mx-auto border-1 p-3'
      >
        {error && <FormError message={error?.message} />}
        <Inputs
          id='name'
          label='full name'
          name='name'
          type='text'
          defaultValue={`${user?.surname} ${user?.otherNames?.split(' ')[0]}`}
        />
        <Inputs
          id='email'
          label='email'
          name='email'
          type='email'
          defaultValue={user?.email}
          capitalized={false}
        />
        <Inputs
          id='contribution'
          label='contribution'
          name='amount'
          type='number'
        />
        <Inputs
          id='description'
          label='description'
          name='description'
          type='text'
        />

        <Button
          btnText={state === 'submitting' ? 'Contributing' : 'contribute'}
          btnType='submit'
          disabled={state === 'submitting'}
        />
      </Form>
    </div>
  );
};

export default ContributeForm;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.post(
      `/payments/contribution/${params.groupId}`,
      formData,
    );
    queryClient.invalidateQueries({ queryKey: ['contribution-transactions'] });
    queryClient.invalidateQueries({ queryKey: ['contribution'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });

    return redirect(response.data.paystack.authorization_url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
