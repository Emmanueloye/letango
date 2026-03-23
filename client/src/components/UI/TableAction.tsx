import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TableAction = ({
  editUrl,
  viewUrl,
  showUserAction = false,
  className,
}: {
  editUrl: string;
  viewUrl: string;
  showUserAction?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center gap-2 border border-[#d1d5dc] ${className}`}
    >
      <Link
        to={editUrl}
        className='bg-amber-600 p-2 rounded-full text-slate-50'
      >
        <FaPencilAlt />
      </Link>
      <Link
        to={viewUrl}
        className='bg-amber-600 p-2 rounded-full text-slate-50'
      >
        <FaEye />
      </Link>
      {showUserAction && (
        <select className='p-1 w-25 capitalize'>
          <option value=''>suspend</option>
          <option value=''>banned</option>
          <option value=''>active</option>
        </select>
      )}
    </div>
  );
};

export default TableAction;
