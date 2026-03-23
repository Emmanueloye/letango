import { FaCalendarAlt } from 'react-icons/fa';
import Button from './Button';
import { useState } from 'react';

const DateRangeSelector = ({
  title = 'Date range',
  handleSetDates,
  isLoading,
}: {
  title?: string;
  handleSetDates: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) => {
  const [isDateBoxOpen, setIsDateBoxOpen] = useState(false);

  return (
    <div className='grid gap-3 mx-auto w-full lg:w-2/4 cursor-pointer'>
      <div
        className='flex justify-between items-center flex-wrap font-500 border p-2 rounded-md'
        onClick={() => setIsDateBoxOpen(!isDateBoxOpen)}
      >
        <h2 className='capitalize'>{title}</h2>
        <FaCalendarAlt />
      </div>
      <form
        method='post'
        onSubmit={(e) => handleSetDates?.(e)}
        className={isDateBoxOpen ? 'grid gap-1.5' : 'hidden'}
      >
        <input type='date' id='start' name='startDate' className='py-1.5' />
        <input type='date' id='end' name='endDate' className='py-1.5' />
        <Button
          btnText={isLoading ? 'generating...' : 'generate'}
          btnType='submit'
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default DateRangeSelector;
