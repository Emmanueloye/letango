import DateRangeSelector from '../../components/UI/DateRangeSelector';
import LinkBtn from '../../components/UI/LinkBtn';
import TransactionBox from '../../components/UI/TransactionBox';

const Statements = () => {
  return (
    <section>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>
      {/* Date selector */}
      <DateRangeSelector showCustomer title='date range & customers' />
      <article>
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
      </article>
    </section>
  );
};

export default Statements;
