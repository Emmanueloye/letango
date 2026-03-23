/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs } from 'react-router-dom';
import ResetPasswordLinkForm from '../../components/AuthComponets/ResetPasswordLinkForm';
import { customFetch, extractFormData } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';

const ResetPasswordLink = () => {
  return <ResetPasswordLinkForm />;
};

export default ResetPasswordLink;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  try {
    const response = await customFetch.post('/auth/forget-password', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
