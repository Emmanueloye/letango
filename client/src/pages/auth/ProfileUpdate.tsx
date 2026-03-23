/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import UpdateProfileForm from '../../components/AuthComponets/UpdateProfileForm';
import { customFetch } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';

const ProfileUpdate = () => {
  return <UpdateProfileForm />;
};

export default ProfileUpdate;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(formData);

  try {
    await customFetch.patch('/users/updateMe', formData);
    return redirect('/account/profile');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
