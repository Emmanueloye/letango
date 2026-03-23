import { useSearchParams } from 'react-router-dom';
import { PAGELIMIT } from '../../dtos/constant';

const ReportPagination = ({ numOfResults }: { numOfResults: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  //   Get current page
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  // Calculate pagecount
  const pageCount = Math.ceil(numOfResults / PAGELIMIT);

  //   next page
  const nextPage = () => {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set('page', `${next}`);
    setSearchParams(searchParams);
  };

  const prevPage = () => {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set('page', `${prev}`);
    setSearchParams(searchParams);
  };

  if (numOfResults <= PAGELIMIT) return null;

  return (
    <div className='flex justify-between items-center font-poppins text-[12px] mt-2 border-t-1 border-amber-500 pt-3 bg-slate-100 dark:bg-slate-500 p-2'>
      <p>
        Showing <span>{(currentPage - 1) * PAGELIMIT + 1}</span> to
        <span>
          {' '}
          &nbsp;
          {currentPage === pageCount ? numOfResults : currentPage * PAGELIMIT}
        </span>
        &nbsp; of
        <span> {numOfResults} records</span>
      </p>
      <div className='flex flex-wrap gap-2'>
        <button
          className='bg-slate-400 px-3 py-1 rounded-md capitalize text-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400'
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          prev
        </button>
        <button
          className='bg-slate-400 px-3 py-1 rounded-md capitalize text-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400'
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default ReportPagination;
