import DateRangeSelector from '../../components/UI/DateRangeSelector';
import LinkBtn from '../../components/UI/LinkBtn';
import Table from '../../components/UI/Table';
import TransactionBox from '../../components/UI/TransactionBox';

const TransactionFlow = () => {
  return (
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>
      {/* Date selector */}

      <DateRangeSelector />
      {/* Table */}
      <div className='hidden lg:block'>
        <h4 className='text-center mt-8 font-600'>Transaction history</h4>
        <Table
          columns='1fr 2fr 1fr'
          headers={['date', 'description', 'inflow']}
        >
          <>
            <p className='border border-gray-300'>April 12, 2025: 11:45pm</p>
            <p className='border border-gray-300'>
              transaction description goes here
            </p>
            <p className='border border-gray-300'>&#8358;20,000</p>
          </>
        </Table>
      </div>
      {/* Transaction cards */}
      <div className='block lg:hidden'>
        <h4 className='text-center mt-8 font-600'>Transaction history</h4>
        <TransactionBox
          description='transaction description goes here'
          date='Thursday, April 4, 2025'
          time='11:45pm'
          amount={20_000}
        />
        <TransactionBox
          description='transaction description goes here'
          date='Thursday, April 4, 2025'
          time='11:45pm'
          amount={20_000}
        />
        <TransactionBox
          description='transaction description goes here'
          date='Thursday, April 4, 2025'
          time='11:45pm'
          amount={20_000}
        />
      </div>
    </>
  );
};

export default TransactionFlow;
