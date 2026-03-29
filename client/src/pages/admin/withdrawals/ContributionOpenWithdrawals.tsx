/* eslint-disable react-refresh/only-export-components */
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import { FaArrowDown, FaArrowUp, FaEye } from 'react-icons/fa';
import { extractParams, queryClient } from '../../../helperFunc.ts/apiRequest';
import { fetchData } from '../../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import {
  ALLOWED_WITHDRAWAL_FIELDS,
  PAGELIMIT,
  PAGENUMBER,
} from '../../../dtos/constant';
import Pagination from '../../../components/UI/Pagination';
import { useState } from 'react';
import { useDebounce } from '../../../Actions/useDebounce';
import SearchBox from '../../../components/UI/SearchBox';
import Empty from '../../../components/UI/Empty';
import { ContributionTransaction } from '../../../dtos/contributionDto';
import { formatDate, formatNumber } from '../../../helperFunc.ts/utilsFunc';

const ContributionOpenWithdrawals = () => {
  const [searchParams] = useSearchParams();

  const { page, limit } = Object.fromEntries(searchParams);

  const [searchField, setSearchField] = useState('withdrawalId');
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['open-withdrawal', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () =>
      fetchData(
        `/contribution-transactions/admin?withdrawalStatus=pending&sort=-paidAt&page=${page || PAGENUMBER}&limit=${limit || PAGELIMIT}`,
      ),
  });

  const safeField = ALLOWED_WITHDRAWAL_FIELDS.includes(searchField)
    ? searchField
    : 'withdrawalId';

  const { data: search } = useQuery({
    queryKey: ['contributions', searchField, searchValue],
    queryFn: () =>
      fetchData(
        `/contribution-transactions/admin?withdrawalStatus=pending&search=${safeField}&value=${debounceValue}`,
      ),
    enabled: debounceValue.trim() !== '',
  });

  const openWithdrawals =
    debounceValue.trim() === ''
      ? data?.transactions
      : (search?.transactions ?? data?.transactions);

  return (
    <section>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/withdrawals' />
      </div>
      {/* Title */}
      <Title title='open withdrawals' />

      {/* Search functionality */}
      <SearchBox
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectOptions={ALLOWED_WITHDRAWAL_FIELDS}
      />

      {openWithdrawals?.length > 0 ? (
        <div className='max-w-5xl mx-auto my-3 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
          {/* Table header */}
          <div className='hidden md:grid grid-cols-7 bg-gray-50 dark:bg-slate-600 border-b border-gray-200 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-200'>
            <div className='uppercase'>contribution</div>
            <div className='uppercase text-right'>withdrawalID</div>
            <div className='uppercase text-right'>Date</div>
            <div className='uppercase text-right'>amount</div>
            <div className='text-right uppercase'>charge</div>
            <div className='text-right uppercase'>net payout</div>
            <div className='text-right uppercase'>action</div>
          </div>
          {/* Table rows */}

          {isLoading ? (
            <Empty message='Loading...' />
          ) : (
            <>
              {openWithdrawals?.map((withdrawal: ContributionTransaction) => {
                return (
                  <div
                    key={withdrawal?._id}
                    className='divide-y divide-gray-200 bg-white dark:bg-slate-500 border-b-1 border-gray-200'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-7 px-6 py-5 md:py-4 items-center font-poppins *:pl-2 *:text-[13px]'>
                      <div className='text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-0 capitalize'>
                        {withdrawal?.contribution}
                      </div>

                      <div className='text-sm text-gray-600 dark:text-gray-200 mb-3 md:mb-0 break-words text-right uppercase'>
                        {withdrawal?.withdrawalId}
                      </div>

                      <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                          {formatDate(new Date(withdrawal?.paidAt))}
                        </span>
                        {/* Mobile and desktop */}
                        <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins capitalize'>
                          {formatDate(new Date(withdrawal?.paidAt))}
                        </span>
                      </div>

                      <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                          {formatNumber(withdrawal.amount)}
                        </span>
                        {/* Mobile and desktop */}
                        <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                          {/* DATE DESKTOP */}
                          {formatNumber(withdrawal.amount)}
                        </span>
                      </div>

                      <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 capitalize text-xs'>
                          {/* Status MOBILE */}
                          {formatNumber(withdrawal.withdrawalCharge)}
                        </span>
                        {/* Mobile and desktop */}
                        <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins capitalize'>
                          {/* status DESKTOP */}
                          {formatNumber(withdrawal.withdrawalCharge)}
                        </span>
                      </div>

                      <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 capitalize text-xs'>
                          {/* Status MOBILE */}
                          {formatNumber(
                            withdrawal?.amount + withdrawal?.withdrawalCharge,
                          )}
                        </span>
                        {/* Mobile and desktop */}
                        <span className='hidden text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins capitalize'>
                          {/* status DESKTOP */}
                          {formatNumber(
                            withdrawal?.amount + withdrawal?.withdrawalCharge,
                          )}
                        </span>
                      </div>

                      <div className='flex justify-between md:block text-sm'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                          <div className='flex justify-end items-center gap-4 text-[18px] mt-3'>
                            <Link
                              to={`/account/admin/contributions/withdrawals/view/${withdrawal.withdrawalId}`}
                            >
                              <FaEye className='cursor-pointer' title='View' />
                            </Link>

                            <FaArrowDown
                              className='cursor-pointer text-rose-600'
                              title='Deactivate'
                              id='deactivate'
                            />

                            <FaArrowUp
                              className='cursor-pointer'
                              title='Activate'
                              id='activate'
                            />
                          </div>
                        </span>
                        {/* Mobile and desktop */}
                        <span className='hidden font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                          <div className='flex justify-end items-center gap-4 text-[18px]'>
                            <Link
                              to={`/account/admin/withdrawals/contributions/view/${withdrawal.withdrawalId}`}
                            >
                              <FaEye className='cursor-pointer' title='View' />
                            </Link>

                            <FaArrowDown
                              className='cursor-pointer text-rose-600'
                              title='Deactivate'
                              id='deactivate'
                            />

                            <FaArrowUp
                              className='cursor-pointer'
                              title='Activate'
                              id='activate'
                            />
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <Empty message='No open withdrawal.' />
      )}
      <Pagination
        totalPages={data?.page?.totalPages}
        currentPage={data?.page?.currentPage}
        nextPage={data?.page?.nextPage}
        previousPage={data?.page?.previousPage}
        baseLink='/account/admin/withdrawals/contributions/open'
      />
    </section>
  );
};

export default ContributionOpenWithdrawals;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { page, limit } = extractParams(request);

  return queryClient.ensureQueryData({
    queryKey: ['open-withdrawal', page ?? PAGENUMBER, limit ?? PAGELIMIT],
    queryFn: () =>
      fetchData(
        `/contribution-transactions/admin?withdrawalStatus=pending&sort=-paidAt&page=${page || PAGENUMBER}&limit=${limit || PAGELIMIT}`,
      ),
  });
};
