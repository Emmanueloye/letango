import { FaPencilAlt } from 'react-icons/fa';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import { Link, useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/usersDto';

const GroupCard = ({
  cardDesc,
  balance,
  detailURLText,
  detailURL,
  editURL,
  icon,
  admins,
  image,
}: {
  cardDesc: string;
  balance?: number;
  detailURLText: string;
  detailURL: string;
  editURL: string;
  icon?: React.ReactElement;
  admins: string[];
  image?: string;
}) => {
  const user = useOutletContext() as User;

  return (
    <div className='bg-gray-100 dark:bg-slate-800 px-2 py-4 rounded-2xl shadow-lg shadow-black/25 cursor-pointer'>
      {/* card header */}

      <div className='flex justify-center items-center flex-col gap-3'>
        <p className='text-center font-500 capitalize'>{cardDesc}</p>
        {admins?.includes(user._id) && (
          <Link to={editURL} className='text-amber-600'>
            <FaPencilAlt title='Edit' />
          </Link>
        )}
      </div>

      {/* Card balance */}

      <p className='text-center text-sm font-poppins mt-3'>
        &#8358;{`${formatNumber(balance ?? 0)}`}
      </p>

      {/* View details link */}
      <div className='flex justify-center mt-3 text-sm underline'>
        <Link to={detailURL} className='capitalize text-center'>
          {detailURLText}
        </Link>
      </div>
      {/* card icon */}
      {image ? (
        <div className='flex justify-center mt-4 text-2xl text-green-600'>
          <img src={image} alt='contribution logo' width={20} height={20} />
        </div>
      ) : (
        <div className='flex justify-center mt-4 text-2xl text-green-600'>
          {icon}
        </div>
      )}
    </div>
  );
};

export default GroupCard;
