/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';
import LoginForm from '../../components/AuthComponets/LoginForm';
import {
  customFetch,
  extractFormData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  return <LoginForm />;
};

export default Login;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.post('/auth/login', formData);
    queryClient.invalidateQueries();

    toast.success(response.data.message);

    return redirect('/account');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
