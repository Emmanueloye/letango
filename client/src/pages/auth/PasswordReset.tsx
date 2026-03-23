/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import PasswordResetForm from '../../components/AuthComponets/PasswordResetForm';
import {
  customFetch,
  extractFormData,
  extractParams,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import { useAppDispatch } from '../../Actions/store';
import { useEffect } from 'react';
import { authActions } from '../../Actions/AuthAction';

const PasswordReset = () => {
  const data = useActionData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.success) {
      dispatch(authActions.setMessage(data.message));
      navigate('/login');
    }
  }, [data, dispatch, navigate]);

  return <PasswordResetForm />;
};

export default PasswordReset;

export const action = async ({ request }: ActionFunctionArgs) => {
  // Get data from form and params
  const params = extractParams(request);
  const data = await extractFormData(request);
  const formData = { ...data, ...params };

  try {
    const response = await customFetch.post('/auth/reset-password', formData);
    queryClient.invalidateQueries();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
