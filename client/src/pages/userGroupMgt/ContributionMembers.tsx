/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  useLocation,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import BackBtn from '../../components/UI/BackBtn';
import Title from '../../components/UI/Title';
import MemberCard from '../../components/UI/MemberCard';
import {
  customFetch,
  extractFormData,
  extractParams,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { fetchContributionMembers } from '../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import {
  ALLOWED_MEMBER_SEARCH_FIELDS,
  PAGELIMIT,
  PAGENUMBER,
} from '../../dtos/constant';
import { IContributionMembers } from '../../dtos/ContributionMembersDto';
import Pagination from '../../components/UI/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User } from '../../dtos/usersDto';
import { useState } from 'react';
import { useDebounce } from '../../Actions/useDebounce';
import SearchBox from '../../components/UI/SearchBox';
import { Contribution } from '../../dtos/contributionDto';

const ContributionMembers = () => {
  // State for search functionality
  const [searchField, setSearchField] = useState('surname');
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 400);

  const { groupId } = useParams();
  const pathEnd = useLocation().pathname.split('/').slice(-1)[0];

  // For pagination
  const [searchParams] = useSearchParams();
  const queries = Object.fromEntries(searchParams);
  const page = Number(queries.page) || PAGENUMBER;
  const limit = Number(queries.limit) || PAGELIMIT;

  const { user, contribution } = useOutletContext() as {
    user: User;
    contribution: Contribution;
  };

  // To check if the current user is admin.
  const isAdmin = contribution?.admins?.includes(user?._id);

  // To switch the query between whether member is admitted or not admitted.
  let isApproved;

  if (pathEnd === 'unadmitted') {
    isApproved = false;
  } else {
    isApproved = true;
  }

  // Fetch initial membership data
  const memberURL = `/contribution-members/${groupId}?isApproved=${isApproved}&page=${page}&limit=${limit}&sort=-joinedAt`;

  const { data } = useQuery({
    queryKey: [
      'contribution-members',
      groupId,
      isApproved,
      page ?? PAGENUMBER,
      limit ?? PAGELIMIT,
    ],
    queryFn: () => fetchContributionMembers(memberURL),
  });

  // Validate the search field to prevent injection of invalid fields into the query
  const safeField = ALLOWED_MEMBER_SEARCH_FIELDS.includes(searchField)
    ? searchField
    : 'surname';

  // For search functionality
  const searchURL = `/contribution-members/${groupId}?isApproved=${isApproved}&search=${safeField}&value=${debounceValue}`;

  const { data: search, isFetching } = useQuery({
    queryKey: ['search', searchField, searchValue],
    queryFn: () => fetchContributionMembers(searchURL),
    enabled: debounceValue.trim() !== '',
  });

  // Switch data depending on whether we are searching or not.
  const members =
    debounceValue.trim() === ''
      ? data?.contributionMembers
      : (search?.contributionMembers ?? data?.contributionMembers);

  return (
    <section>
      <BackBtn url={`/account/manage-group/view/${groupId}`} />
      <Title title='Membership' />
      {/* tab btns */}
      {isAdmin && (
        <div className='flex flex-wrap justify-center gap-2'>
          <Link
            to={`/account/manage-group/view/${groupId}/members`}
            className={`${pathEnd === 'unadmitted' ? 'bg-transparent border-b-2 border-green-600 text-slate-700 dark:text-slate-200' : 'bg-green-600'} py-1 px-3 rounded-md capitalize font-600 text-slate-100 cursor-pointer`}
          >
            admitted
          </Link>

          <Link
            to={`/account/manage-group/view/${groupId}/members/unadmitted`}
            className={`${pathEnd !== 'unadmitted' ? 'bg-transparent border-b-3 border-amber-600 text-slate-800 dark:text-slate-100' : 'bg-amber-600'} py-1 px-3 rounded-md capitalize font-600 text-slate-100 cursor-pointer`}
          >
            unadmitted
          </Link>
        </div>
      )}

      {/* Search functionality */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isAdmin={isAdmin}
        selectOptions={['surname', 'otherNames']}
      />
      <div className='text-center mt-2'>
        {debounceValue && isFetching && <p className='text-sm'>Searching...</p>}
      </div>
      {/* admitted tab */}

      <div className='admitted'>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-4'>
          {members?.map((member: IContributionMembers) => {
            return <MemberCard key={member?._id} member={member} />;
          })}
        </div>
        <Pagination
          totalPages={data?.page?.totalPages}
          currentPage={data?.page?.currentPage}
          nextPage={data?.page?.nextPage}
          previousPage={data?.page?.previousPage}
          baseLink={
            pathEnd === 'unadmitted'
              ? `/account/manage-group/view/${groupId}/members/unadmitted`
              : `/account/manage-group/view/${groupId}/members`
          }
        />
      </div>
    </section>
  );
};

export default ContributionMembers;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { groupId } = params;
  const queries = extractParams(request);
  const page = Number(queries.page) || PAGENUMBER;
  const limit = Number(queries.limit) || PAGELIMIT;

  const lastURL = request.url.split('/').slice(-1)[0];

  let isApproved;

  if (lastURL === 'unadmitted') {
    isApproved = false;
  } else {
    isApproved = true;
  }

  const url = `/contribution-members/${groupId}?isApproved=${isApproved}&page=${page}&limit=${limit}&sort=-joinedAt`;

  await queryClient.ensureQueryData({
    queryKey: [
      'contribution-members',
      groupId,
      isApproved,
      page ?? PAGENUMBER,
      limit ?? PAGELIMIT,
    ],
    queryFn: () => fetchContributionMembers(url),
  });

  return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  try {
    const response = await customFetch.patch(
      `/contribution-members/${params.groupId}`,
      formData,
    );
    queryClient.invalidateQueries();
    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.message || 'An error occurred');
      return error?.response?.data;
    }
  }

  return null;
};
