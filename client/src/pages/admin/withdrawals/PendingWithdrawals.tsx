import TransactionBox from '../../../components/UI/TransactionBox';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';

const PendingWithdrawals = () => {
  return (
    <section>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/withdrawals' />
      </div>
      {/* Title */}
      <Title title='pending approval withdrawals' />
      <>
        {/* first */}

        <TransactionBox
          description='payment to Jan contributor'
          date='April 17, 2025'
          time='11:23am'
          amount={40_000}
          show
        />

        {/* second */}

        <TransactionBox
          description='payment to Jan contributor'
          date='April 17, 2025'
          time='11:23am'
          amount={40_000}
          show
        />
      </>
    </section>
  );
};

export default PendingWithdrawals;
