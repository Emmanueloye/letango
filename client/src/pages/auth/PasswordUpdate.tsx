/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import PasswordUpdateForm from '../../components/AuthComponets/PasswordUpdateForm';
import { customFetch, extractFormData } from '../../helperFunc.ts/apiRequest';
import { toast } from 'react-toastify';
import axios from 'axios';

const PasswordUpdate = () => {
  return <PasswordUpdateForm />;
};

export default PasswordUpdate;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.patch(
      '/users/change-password',
      formData,
    );
    toast.success(response.data.message);
    return redirect('/login');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
