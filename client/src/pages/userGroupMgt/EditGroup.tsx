/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from 'react-router-dom';
import EditGroupForm from '../../components/DashboardComponents/EditGroupForm';
import { customFetch, queryClient } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import { fetchContribution } from '../../helperFunc.ts/contributionsRequest';

const EditGroup = () => {
  return <EditGroupForm />;
};

export default EditGroup;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    await customFetch.patch(`/contributions/${params.groupId}`, formData);
    queryClient.invalidateQueries({ queryKey: ['contributions'] });
    queryClient.invalidateQueries({ queryKey: ['contribution'] });
    return redirect('/account/manage-group');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const groupId = params.groupId;
  const response = queryClient.ensureQueryData({
    queryKey: ['contribution', groupId],
    queryFn: () => fetchContribution(groupId as string),
  });

  return response;
};
