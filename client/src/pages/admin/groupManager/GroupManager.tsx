/* eslint-disable react-refresh/only-export-components */
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router-dom';
import Title from '../../../components/UI/Title';
import { FaArrowDown, FaArrowUp, FaEdit, FaEye } from 'react-icons/fa';
import {
  customFetch,
  extractParams,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import {
  ALLOWED_CONTRIBUTION_FIELDS,
  PAGELIMIT,
  PAGENUMBER,
} from '../../../dtos/constant';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../../components/UI/Empty';
import { Contribution } from '../../../dtos/contributionDto';
import { formatDate, formatNumber } from '../../../helperFunc.ts/utilsFunc';
import Pagination from '../../../components/UI/Pagination';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useDebounce } from '../../../Actions/useDebounce';
import SearchBox from '../../../components/UI/SearchBox';

const GroupManager = () => {
  const [searchParams] = useSearchParams();

  const { page, limit } = Object.fromEntries(searchParams);

  const pageNumber = page || PAGENUMBER;
  const pageLimit = limit || PAGELIMIT;

  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['contributions', pageNumber, pageLimit],
    queryFn: () =>
      fetchData(`/contributions/admin?page=${pageNumber}&limit=${pageLimit}`),
  });

  const safeField = ALLOWED_CONTRIBUTION_FIELDS.includes(searchField)
    ? searchField
    : 'name';

  const { data: search } = useQuery({
    queryKey: ['contributions', searchField, searchValue],
    queryFn: () =>
      fetchData(
        `/contributions/admin?search=${safeField}&value=${debounceValue}`,
      ),
    enabled: debounceValue.trim() !== '',
  });

  const contributions =
    debounceValue.trim() === ''
      ? data?.contributions
      : (search?.contributions ?? data?.contributions);

  // Handle activationa and deactivation of users
  const handleUserStatus = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    contributionId: string,
  ) => {
    const action = e.currentTarget.id;

    if (action === 'deactivate') {
      const data = { isActive: false };
      await customFetch.patch(`/contributions/admin/${contributionId}`, data);
      toast.success(`contribution status has been updated successfully.`);
    }

    if (action === 'activate') {
      const data = { isActive: true };
      await customFetch.patch(`/contributions/admin/${contributionId}`, data);
      toast.success(`contribution status has been updated successfully.`);
    }

    queryClient.invalidateQueries({ queryKey: ['contributions'] });
    queryClient.invalidateQueries({ queryKey: ['contribution'] });
  };

  return (
    <section>
      <Title title='manage groups' />

      {/* Search functionality */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectOptions={['name']}
      />

      <div className='max-w-5xl mx-auto my-3 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
        {/* Table header */}
        <div className='hidden md:grid grid-cols-5 bg-gray-50 dark:bg-slate-600 border-b border-gray-200 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-200'>
          <div className='uppercase'>contribution</div>
          <div className='uppercase text-right'>balance</div>
          <div className='uppercase text-right'>eff. balance</div>
          <div className='text-right uppercase'>createdAt</div>
          <div className='text-right uppercase'>action</div>
        </div>
        {/* Table rows */}

        {isLoading ? (
          <Empty message='Loading...' />
        ) : (
          <>
            {contributions?.length > 0 ? (
              <>
                {contributions?.map((contribution: Contribution) => {
                  return (
                    <div
                      key={contribution?._id}
                      className='divide-y divide-gray-200 bg-white dark:bg-slate-500 border-b-1 border-gray-200'
                    >
                      <div className='grid grid-cols-1 md:grid-cols-5 px-6 py-5 md:py-4 items-center hover:bg-gray-50 transition-colors font-poppins'>
                        <div className='text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-0 capitalize'>
                          {contribution?.name}
                        </div>

                        <div className='text-sm text-gray-600 dark:text-gray-200 mb-3 md:mb-0 lowercase break-words text-right'>
                          {formatNumber(contribution?.balance)}
                        </div>

                        <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                          {/* For mobile view */}
                          <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                            {formatNumber(contribution?.effectiveBalance)}
                          </span>
                          {/* Mobile and desktop */}
                          <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                            {formatNumber(contribution?.effectiveBalance)}
                          </span>
                        </div>

                        <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                          {/* For mobile view */}
                          <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                            {formatDate(new Date(contribution?.createdAt))}
                          </span>
                          {/* Mobile and desktop */}
                          <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                            {formatDate(new Date(contribution?.createdAt))}
                          </span>
                        </div>

                        <div className='flex justify-between md:block text-sm'>
                          {/* For mobile view */}
                          <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                            <div className='flex justify-end items-center gap-4 text-[18px] mt-3'>
                              <Link
                                to={`/account/admin/contributions/edit/${contribution?.ref}`}
                              >
                                <FaEdit
                                  className='cursor-pointer'
                                  title='Edit'
                                />
                              </Link>
                              <Link
                                to={`/account/admin/contributions/view/${contribution?.ref}`}
                              >
                                <FaEye
                                  className='cursor-pointer'
                                  title='View'
                                />
                              </Link>
                              {contribution?.isActive ? (
                                <FaArrowDown
                                  className='cursor-pointer text-rose-600'
                                  title='Deactivate'
                                  id='deactivate'
                                  onClick={(e) =>
                                    handleUserStatus(e, contribution?.ref)
                                  }
                                />
                              ) : (
                                <FaArrowUp
                                  className='cursor-pointer'
                                  title='Activate'
                                  id='activate'
                                  onClick={(e) =>
                                    handleUserStatus(e, contribution?.ref)
                                  }
                                />
                              )}
                            </div>
                          </span>
                          {/* Mobile and desktop */}
                          <span className='hidden font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                            <div className='flex justify-end items-center gap-4 text-[18px]'>
                              <Link
                                to={`/account/admin/contributions/edit/${contribution?.ref}`}
                              >
                                <FaEdit
                                  className='cursor-pointer'
                                  title='Edit'
                                />
                              </Link>
                              <Link
                                to={`/account/admin/contributions/view/${contribution?.ref}`}
                              >
                                <FaEye
                                  className='cursor-pointer'
                                  title='View'
                                />
                              </Link>

                              {contribution?.isActive ? (
                                <FaArrowDown
                                  className='cursor-pointer text-rose-600'
                                  title='Deactivate'
                                  id='deactivate'
                                  onClick={(e) =>
                                    handleUserStatus(e, contribution?.ref)
                                  }
                                />
                              ) : (
                                <FaArrowUp
                                  className='cursor-pointer'
                                  title='Activate'
                                  id='activate'
                                  onClick={(e) =>
                                    handleUserStatus(e, contribution?.ref)
                                  }
                                />
                              )}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <Empty message='No available contribution group' />
            )}
          </>
        )}

        <Pagination
          totalPages={data?.page?.totalPages}
          currentPage={data?.page?.currentPage}
          nextPage={data?.page?.nextPage}
          previousPage={data?.page?.previousPage}
          baseLink='/account/admin/contributions'
        />
      </div>
    </section>
  );
};

export default GroupManager;

export const loader = ({ request }: LoaderFunctionArgs) => {
  const { page, limit } = extractParams(request);
  const pageNumber = page || PAGENUMBER;
  const pageLimit = limit || PAGELIMIT;

  return queryClient.ensureQueryData({
    queryKey: ['contributions', pageNumber, pageLimit],
    queryFn: () =>
      fetchData(`/contributions/admin?page=${pageNumber}&limit=${pageLimit}`),
  });
};
