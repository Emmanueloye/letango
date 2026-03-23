/* eslint-disable react-refresh/only-export-components */
import {
  LoaderFunctionArgs,
  Outlet,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { queryClient } from '../helperFunc.ts/apiRequest';
import { fetchContribution } from '../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { User } from '../dtos/usersDto';

const GroupLayout = () => {
  const { groupId } = useParams();
  const user = useOutletContext() as User;

  const { data } = useQuery({
    queryKey: ['contribution', groupId],
    queryFn: () => fetchContribution(groupId as string),
  });
  return (
    <section>
      <Outlet
        context={{
          user,
          contribution: data?.contribution,
          inviteLink: data?.inviteLink,
        }}
      />
    </section>
  );
};

export default GroupLayout;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['contribution', params.groupId],
    queryFn: () => fetchContribution(params.groupId as string),
  });
};
