/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import CreateGroupForm from '../../components/DashboardComponents/CreateGroupForm';
import { customFetch, extractFormData } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';

const CreateGroup = () => {
  return <CreateGroupForm />;
};

export default CreateGroup;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  try {
    await customFetch.post('/contributions', formData);
    return redirect('/account/manage-group');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
