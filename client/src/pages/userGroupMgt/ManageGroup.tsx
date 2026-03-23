/* eslint-disable react-refresh/only-export-components */
import { FaUserGroup } from 'react-icons/fa6';
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router-dom';
import GroupCard from '../../components/DashboardComponents/GroupCard';
import { extractParams, queryClient } from '../../helperFunc.ts/apiRequest';

import { useQuery } from '@tanstack/react-query';
import { fetchContributions } from '../../helperFunc.ts/contributionsRequest';
import { Contribution } from '../../dtos/contributionDto';
import Pagination from '../../components/UI/Pagination';
import {
  ALLOWED_CONTRIBUTION_FIELDS,
  PAGELIMIT,
  PAGENUMBER,
} from '../../dtos/constant';
import SearchBox from '../../components/UI/SearchBox';
import { useState } from 'react';
import { useDebounce } from '../../Actions/useDebounce';

const ManageGroup = () => {
  const [searchParams] = useSearchParams();
  const queries = Object.fromEntries(searchParams);
  const page = Number(queries.page) || PAGENUMBER;
  const limit = Number(queries.limit) || PAGELIMIT;

  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 400);

  const contributionUrl = `/contributions?page=${page}&limit=${limit}`;

  const { data } = useQuery({
    queryKey: ['contributions', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () => fetchContributions(contributionUrl),
  });

  const safeField = ALLOWED_CONTRIBUTION_FIELDS.includes(searchField)
    ? searchField
    : 'name';

  const contributionSearchURL = `/contributions?search=${safeField}&value=${debounceValue}`;

  const { data: search } = useQuery({
    queryKey: ['contributions', searchField, searchValue],
    queryFn: () => fetchContributions(contributionSearchURL),
    enabled: debounceValue.trim() !== '',
  });

  const contributions =
    debounceValue.trim() === ''
      ? data?.contributions
      : (search?.contributions ?? data?.contributions);

  return (
    <section>
      <div className='flex gap-1 flex-wrap'>
        <Link
          to='/account/manage-group/create-group'
          className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
        >
          New Contribution
        </Link>
        <Link
          to='/account/manage-group/create-group'
          className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
        >
          New Club & Association
        </Link>
      </div>

      {/* Search functionality */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectOptions={['name']}
      />

      <div className='grid lg:grid-cols-4 gap-3 mt-8'>
        {contributions?.map((contribution: Contribution) => {
          return (
            <GroupCard
              key={contribution._id}
              cardDesc={contribution.name}
              balance={contribution.balance}
              image={contribution.logo}
              icon={<FaUserGroup />}
              detailURLText={'view contribution'}
              detailURL={`/account/manage-group/view/${contribution.ref}`}
              editURL={`/account/manage-group/update-group/${contribution.ref}`}
              admins={contribution.admins}
            />
          );
        })}
      </div>

      <Pagination
        totalPages={data?.page?.totalPages}
        currentPage={data?.page?.currentPage}
        nextPage={data?.page?.nextPage}
        previousPage={data?.page?.previousPage}
        baseLink='/account/manage-group'
      />
    </section>
  );
};

export default ManageGroup;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const queries = extractParams(request);
  const page = Number(queries.page) || PAGENUMBER;
  const limit = Number(queries.limit) || PAGELIMIT;

  const contributionUrl = `/contributions?page=${page}&limit=${limit}`;

  return queryClient.ensureQueryData({
    queryKey: ['contributions', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () => fetchContributions(contributionUrl),
  });
};
