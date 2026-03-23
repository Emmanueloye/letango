/* eslint-disable react-refresh/only-export-components */
import { FaArrowDown, FaArrowUp, FaEdit, FaEye } from 'react-icons/fa';
import Title from '../../../components/UI/Title';
import {
  customFetch,
  extractParams,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router-dom';
import {
  ALLOWED_MEMBER_SEARCH_FIELDS,
  PAGELIMIT,
  PAGENUMBER,
} from '../../../dtos/constant';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../../components/UI/Empty';
import { User } from '../../../dtos/usersDto';
import { formatDate } from '../../../helperFunc.ts/utilsFunc';
import Pagination from '../../../components/UI/Pagination';
import { toast } from 'react-toastify';
import SearchBox from '../../../components/UI/SearchBox';
import { useState } from 'react';
import { useDebounce } from '../../../Actions/useDebounce';

const UserManager = () => {
  const [searchParams] = useSearchParams();
  const { page, limit } = Object.fromEntries(searchParams);

  const [searchField, setSearchField] = useState('surname');
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 400);

  const url = `/users?page=${page || PAGENUMBER}&limit=${limit || PAGELIMIT}`;

  const { data, isLoading } = useQuery({
    queryKey: ['users', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () => fetchData(url),
  });

  const safeField = ALLOWED_MEMBER_SEARCH_FIELDS.includes(searchField)
    ? searchField
    : 'surname';

  const { data: search } = useQuery({
    queryKey: ['users', searchField, searchValue],
    queryFn: () =>
      fetchData(`/users?search=${safeField}&value=${debounceValue}`),
    enabled: debounceValue.trim() !== '',
  });

  const users =
    debounceValue.trim() === '' ? data?.users : (search?.users ?? data?.users);

  // Handle activationa and deactivation of users
  const handleUserStatus = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    userRef: string,
  ) => {
    const action = e.currentTarget.id;

    if (action === 'deactivate') {
      const data = { isActive: false };
      await customFetch.patch(`/users/${userRef}`, data);
      toast.success(`User status has been updated successfully.`);
    }

    if (action === 'activate') {
      const data = { isActive: true };
      await customFetch.patch(`/users/${userRef}`, data);
      toast.success(`User status has been updated successfully.`);
    }

    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <section>
      <Title title='manage users' />

      {/* Search functionality */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectOptions={['surname', 'otherNames', 'email']}
      />

      {/* The table */}
      <div className='max-w-5xl mx-auto my-3 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
        {/* Table header */}
        <div className='hidden md:grid grid-cols-4 bg-gray-50 dark:bg-slate-600 border-b border-gray-200 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-200'>
          <div className='upper'>name</div>
          <div className='upper'>email</div>
          <div className='text-right uppercase'>reg date</div>
          <div className='text-right uppercase'>action</div>
        </div>
        {/* Table rows */}
        <>
          {isLoading ? (
            <Empty message='Loading...' />
          ) : (
            <>
              {users?.length > 0 ? (
                <>
                  {users?.map((user: User) => {
                    return (
                      <div
                        key={user._id}
                        className='divide-y divide-gray-200 bg-white dark:bg-slate-500 border-b-1 border-gray-200'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-4 px-6 py-5 md:py-4 items-center hover:bg-gray-50 transition-colors'>
                          <div className='text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-0 capitalize'>
                            {user?.surname} {user?.otherNames.split(' ')[0]}
                          </div>

                          <div className='text-sm text-gray-600 dark:text-gray-200 mb-3 md:mb-0 lowercase break-words'>
                            {user?.email}
                          </div>

                          <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                            {/* For mobile view */}
                            <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                              {formatDate(new Date(user?.createdAt))}
                            </span>
                            {/* Mobile and desktop */}
                            <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                              {formatDate(new Date(user?.createdAt))}
                            </span>
                          </div>

                          <div className='flex justify-between md:block text-sm'>
                            {/* For mobile view */}
                            <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                              <div className='flex justify-end items-center gap-4 text-[18px] mt-3'>
                                <Link
                                  to={`/account/admin/user-manager/edit/${user?.userRef}`}
                                >
                                  <FaEdit
                                    className='cursor-pointer'
                                    title='Edit'
                                  />
                                </Link>
                                <Link
                                  to={`/account/admin/user-manager/view/${user?.userRef}`}
                                >
                                  <FaEye
                                    className='cursor-pointer'
                                    title='View'
                                  />
                                </Link>
                                {user?.isActive ? (
                                  <FaArrowDown
                                    className='cursor-pointer text-rose-600'
                                    title='Deactivate'
                                    id='deactivate'
                                    onClick={(e) =>
                                      handleUserStatus(e, user.userRef)
                                    }
                                  />
                                ) : (
                                  <FaArrowUp
                                    className='cursor-pointer'
                                    title='Activate'
                                    id='activate'
                                    onClick={(e) =>
                                      handleUserStatus(e, user.userRef)
                                    }
                                  />
                                )}
                              </div>
                            </span>
                            {/* Mobile and desktop */}
                            <span className='hidden font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                              <div className='flex justify-end items-center gap-4 text-[18px]'>
                                <Link
                                  to={`/account/admin/user-manager/edit/${user?.userRef}`}
                                >
                                  <FaEdit
                                    className='cursor-pointer'
                                    title='Edit'
                                  />
                                </Link>
                                <Link
                                  to={`/account/admin/user-manager/view/${user?.userRef}`}
                                >
                                  <FaEye
                                    className='cursor-pointer'
                                    title='View'
                                  />
                                </Link>
                                {user?.isActive ? (
                                  <FaArrowDown
                                    className='cursor-pointer text-rose-600'
                                    title='Deactivate'
                                    id='deactivate'
                                    onClick={(e) =>
                                      handleUserStatus(e, user.userRef)
                                    }
                                  />
                                ) : (
                                  <FaArrowUp
                                    className='cursor-pointer'
                                    title='Activate'
                                    id='activate'
                                    onClick={(e) =>
                                      handleUserStatus(e, user.userRef)
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
                <Empty message='No available user information.' />
              )}
            </>
          )}
        </>
        <Pagination
          totalPages={data?.page?.totalPages}
          currentPage={data?.page?.currentPage}
          nextPage={data?.page?.nextPage}
          previousPage={data?.page?.previousPage}
          baseLink='/account/admin/user-manager'
        />
      </div>
    </section>
  );
};

export default UserManager;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { page, limit } = extractParams(request);

  const url = `/users?page=${page || PAGENUMBER}&limit=${limit || PAGELIMIT}`;

  return queryClient.ensureQueryData({
    queryKey: ['users', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () => fetchData(url),
  });
};
