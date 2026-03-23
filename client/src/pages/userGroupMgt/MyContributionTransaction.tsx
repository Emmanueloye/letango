import { useParams, useSearchParams } from 'react-router-dom';
import BackBtn from '../../components/UI/BackBtn';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import Title from '../../components/UI/Title';
import { fetchOnlyData } from '../../helperFunc.ts/contributionsRequest';
import { PAGELIMIT, PAGENUMBER } from '../../dtos/constant';
import { ContributionTransaction } from '../../dtos/contributionDto';
import {
  formatDate,
  formatNumber,
  paginate,
} from '../../helperFunc.ts/utilsFunc';
import Empty from '../../components/UI/Empty';
import FormError from '../../components/UI/FormError';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../Actions/store';
import { dateActions, format } from '../../Actions/ReportDateAction';
import ReportPagination from '../../components/UI/ReportPagination';

const MyContributionTransaction = () => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { startIndex, endIndex } = paginate(searchParams);

  const queryParams = Object.fromEntries(searchParams);

  const { startDate, endDate } = useAppSelector((state) => state.date);

  const handleSetDates = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    dispatch(
      dateActions.setDates({
        startDate: format(new Date(formData.startDate as string)),
        endDate: format(new Date(formData.endDate as string)),
      }),
    );
  };

  const url = `/contribution-transactions/transactions?startDate=${startDate}&endDate=${endDate}&groupRef=${groupId}&page=${queryParams.page || PAGENUMBER}&limit=${queryParams.limit || PAGELIMIT}`;

  const { data, isFetching } = useQuery({
    queryKey: [
      'transactions',
      startDate,
      endDate,
      queryParams.page ?? PAGENUMBER,
      queryParams.limit ?? PAGELIMIT,
      groupId,
    ],
    queryFn: () => fetchOnlyData(url),
  });

  let error;

  if (!data?.success) {
    error = { message: data?.message };
  }

  const paginateReports: ContributionTransaction[] = data?.transactions?.slice(
    startIndex,
    endIndex,
  );

  const transactions: ContributionTransaction[] = data?.transactions;

  const totalContribution = transactions?.reduce((acc, item) => {
    if (item.amount > 0) {
      return acc + item.amount;
    }
    return acc;
  }, 0);

  const totalPayout = transactions?.reduce((acc, item) => {
    if (item.amount < 0) {
      return acc + item.amount;
    }
    return acc;
  }, 0);

  const totalBalance = transactions?.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  let runningBalance = 0;

  return (
    <section>
      <BackBtn url={`/account/manage-group/view/${groupId}`} />

      <Title title='My transactions' />
      {error && error?.message && <FormError message={error?.message} />}
      {/* Date selector */}
      <DateRangeSelector
        title='date range'
        handleSetDates={handleSetDates}
        isLoading={isFetching}
      />

      {transactions && transactions.length > 0 ? (
        <>
          {isFetching ? (
            <Empty message='Loading...' />
          ) : (
            <>
              {/* Tablle top */}
              <div className='bg-gray-50 dark:bg-slate-600 mt-2 p-3 rounded-md font-poppins text-sm'>
                <p className='capitalize'>
                  Start date: {formatDate(new Date(data?.startingDate))}
                </p>
                <p className='capitalize'>
                  End date:{' '}
                  {formatDate(new Date(data?.endingDate.split('T')[0]))}
                </p>
                <p>Cost/-Benefit: {formatNumber(totalBalance)}</p>
              </div>

              {/* The table */}
              <div className='max-w-5xl mx-auto my-3 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
                {/* Table header */}
                <div className='hidden md:grid grid-cols-5 bg-gray-50 dark:bg-slate-600 border-b border-gray-200 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-200'>
                  <div className='upper'>date</div>
                  <div className='upper'>description</div>
                  <div className='text-right uppercase'>contribution</div>
                  <div className='text-right uppercase'>payout</div>
                  <div className='text-right uppercase'>balance</div>
                </div>
                {/* Table rows */}
                <>
                  {paginateReports?.map((doc) => {
                    // Contributor's name
                    const name = `${doc?.contributedBy?.surname} ${doc?.contributedBy?.otherNames.split(' ')[0]} `;

                    // Transaction description
                    const description =
                      doc?.transactionType === 'contribution'
                        ? `${doc?.transactionType} from ${name} - ${doc?.description} `
                        : `${doc?.transactionType} for ${name} - ${doc?.description}`;

                    return (
                      <div
                        key={doc._id}
                        className='divide-y divide-gray-200 bg-white dark:bg-slate-500 border-b-1 border-gray-200'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-5 px-6 py-5 md:py-4 items-center hover:bg-gray-50 transition-colors'>
                          <div className='text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-0'>
                            {formatDate(new Date(doc?.paidAt))}
                          </div>

                          <div className='text-sm text-gray-600 dark:text-gray-200 mb-3 md:mb-0 capitalize'>
                            {description}{' '}
                            {doc.withdrawalStatus === 'pending' && (
                              <span className='text-rose-500'>
                                - {doc.withdrawalStatus}
                              </span>
                            )}
                          </div>

                          <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                            {/* For mobile view */}
                            <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                              {doc?.amount > 0 ? formatNumber(doc?.amount) : 0}
                            </span>
                            {/* Mobile and desktop */}
                            <span className='text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                              {doc?.amount > 0 ? formatNumber(doc?.amount) : 0}
                            </span>
                          </div>

                          <div className='flex justify-between md:block text-sm'>
                            {/* For mobile view */}
                            <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                              Payout
                            </span>
                            {/* Mobile and desktop */}
                            <span className='font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                              {doc?.amount < 0 ? formatNumber(doc?.amount) : 0}
                            </span>
                          </div>

                          {/* Balance */}
                          <div className='flex justify-between md:block text-sm'>
                            {/* For mobile view */}
                            <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                              Balance
                            </span>
                            {/* Mobile and desktop */}
                            <span className='text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                              {formatNumber((runningBalance += doc?.amount))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total section */}
                  <div className='divide-y divide-gray-200 bg-white dark:bg-slate-600 uppercase border-b-1 border-gray-200'>
                    <div className='grid grid-cols-1 md:grid-cols-5 px-6 py-5 md:py-4 items-center hover:bg-gray-50 transition-colors'>
                      <div className='text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-0'>
                        Total
                      </div>

                      <div className='text-sm text-gray-600 dark:text-gray-200 mb-3 md:mb-0 capitalize'></div>

                      <div className='flex justify-between md:block text-sm mb-1 md:mb-0'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 dark:text-gray-200 uppercase text-xs'>
                          Contribution
                        </span>
                        {/* Mobile and desktop */}
                        <span className='text-gray-700 dark:text-gray-200 md:text-right md:block font-poppins'>
                          {formatNumber(totalContribution || 0)}
                        </span>
                      </div>

                      <div className='flex justify-between md:block text-sm'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                          Payout
                        </span>
                        {/* Mobile and desktop */}
                        <span className='font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                          {formatNumber(totalPayout || 0)}
                        </span>
                      </div>

                      {/* Total balance */}
                      <div className='flex justify-between md:block text-sm'>
                        {/* For mobile view */}
                        <span className='md:hidden font-semibold text-gray-400 uppercase text-xs'>
                          Balance
                        </span>
                        {/* Mobile and desktop */}
                        <span className='font-bold text-green-600 dark:text-green-300 md:text-right md:block font-poppins'>
                          {formatNumber(totalBalance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
                <ReportPagination numOfResults={data?.transactions?.length} />
              </div>
            </>
          )}
        </>
      ) : (
        <Empty message='Transaction data is not available. Carry out transaction or generate report by selecting the required date if you have not do so.' />
      )}
    </section>
  );
};

export default MyContributionTransaction;
