import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const Card = ({
  cardDesc,
  balance,
  optionalText,
  icon,
}: {
  cardDesc: string;
  balance?: number;
  optionalText?: string;
  icon: React.ReactElement;
}) => {
  return (
    <div className='flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-800 px-2 py-4 rounded-2xl shadow-lg shadow-black/25 cursor-pointer'>
      <p className='text-center font-500 capitalize'>{cardDesc}</p>
      {balance && (
        <p className='text-center text-sm font-poppins mt-3'>
          &#8358;{`${formatNumber(balance)}`}
        </p>
      )}
      {optionalText && (
        <p className='text-center text-sm font-poppins mt-3'>{optionalText}</p>
      )}
      <div className='flex justify-center mt-4 text-2xl text-green-600'>
        {icon}
      </div>
    </div>
  );
};

export default Card;
