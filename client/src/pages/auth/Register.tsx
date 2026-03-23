/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import RegisterForm from '../../components/AuthComponets/RegisterForm';
import { customFetch, extractFormData } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import { useEffect } from 'react';
import { useAppDispatch } from '../../Actions/store';
import { authActions } from '../../Actions/AuthAction';

const Register = () => {
  const data = useActionData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log(data);

  useEffect(() => {
    if (data?.success && data?.message) {
      dispatch(authActions.setMessage(data.message));
      navigate('/login');
    }
  }, [data, dispatch, navigate]);

  return <RegisterForm />;
};

export default Register;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
