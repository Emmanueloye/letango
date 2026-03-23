import DateRangeSelector from '../../components/UI/DateRangeSelector';
import LinkBtn from '../../components/UI/LinkBtn';

const GroupStatement = () => {
  return (
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/manage-group/view/1/reports' />
      </div>
      <DateRangeSelector />
      <div className='grid md:grid-cols-2 mt-4'>
        {/* Income section */}
        <div>
          {/* Header */}
          <h3 className='border p-1 capitalize font-600'>Income</h3>
          {/* income details box */}
          <div className='border *:even:bg-gray-200 *:dark:even:bg-slate-600'>
            <div className='flex justify-between p-1 capitalize'>
              <span>income</span>
              <span>10,000</span>
            </div>
            <div className='flex justify-between p-1 capitalize'>
              <span>income</span>
              <span>10,000</span>
            </div>
            {/* Total income box */}
            <div className=' border-t flex justify-between p-1 capitalize font-600'>
              <span>total income</span>
              <span>20,000</span>
            </div>
          </div>
        </div>
        {/* Expenses section */}
        <div>
          <h3 className='border p-1 capitalize font-600'>expense</h3>
          {/* expenses details box */}
          <div className='border *:even:bg-gray-200 *:dark:even:bg-slate-600'>
            <div className='flex justify-between p-1 capitalize'>
              <span>expense</span>
              <span>10,000</span>
            </div>
            <div className='flex justify-between p-1 capitalize'>
              <span>expense</span>
              <span>10,000</span>
            </div>
            {/* total expenses box */}
            <div className=' border-t flex justify-between p-1 capitalize font-600'>
              <span>total expenses</span>
              <span>20,000</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupStatement;
