import { Link } from 'react-router-dom';
import { IPages } from '../../dtos/utilsDto';

const Pagination = ({
  totalPages,
  currentPage,
  nextPage,
  previousPage,
  baseLink,
}: IPages) => {
  return (
    <>
      {totalPages > 1 && (
        <div className='flex justify-end mt-6'>
          {previousPage ? (
            <Link
              to={`${baseLink}?page=${previousPage}`}
              className='bg-amber-700 px-6 py-1.5 capitalize text-sm font-500 rounded-l-3xl text-slate-50'
            >
              prev
            </Link>
          ) : (
            <button className='bg-amber-700 px-6 py-1.5 text-slate-50 capitalize text-sm font-500 rounded-l-3xl cursor-not-allowed'>
              prev
            </button>
          )}

          <button className='bg-primary-500 px-6 py-1.5 text-slate-50 capitalize text-sm font-poppins font-500'>
            {currentPage} of {totalPages}
          </button>

          {nextPage ? (
            <Link
              to={`${baseLink}?page=${nextPage}`}
              className='bg-amber-700 px-6 py-1.5 capitalize text-sm font-500 rounded-r-3xl text-slate-50'
            >
              next
            </Link>
          ) : (
            <button className='bg-amber-700 px-6 py-1.5 capitalize text-sm font-500 rounded-r-3xl cursor-not-allowed text-slate-50'>
              next
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
