import { FaLock } from 'react-icons/fa';
import Card from '../../../components/UI/Card';
import { Link } from 'react-router-dom';
import Chart from '../../../components/DashboardComponents/Chart';

// Temp data
const withdrawalData = [
  { name: 'Jan', amount: 20000 },
  { name: 'Feb', amount: 20000 },
  { name: 'Mar', amount: 20000 },
];

const WithdrawalLanding = () => {
  return (
    <>
      <div className='grid md:grid-cols-3 gap-4'>
        <div>
          <ul>
            <li className='font-600 mb-2'>Contribution</li>
            <li className='ml-3 text-sm mb-2'>
              <Link to='/account/admin/withdrawals/contributions/open'>
                Open withdrawals
              </Link>
            </li>
            <li className='ml-3 text-sm'>
              <Link to='/account/admin/withdrawals/contributions/closed'>
                Processed withdrawals
              </Link>
            </li>
          </ul>
        </div>
        {/* <Link to='/account/admin/withdrawals/contributions/open'>
          <Card
            cardDesc='closed withdrawals'
            balance={30_000}
            icon={<FaLock />}
          />
        </Link>
        <Link to='/account/admin/withdrawals/pending'>
          <Card
            cardDesc='awaiting approval'
            balance={30_000}
            icon={<FaLock />}
          />
        </Link> */}
      </div>
      {/* <Chart
        data={withdrawalData}
        xAxisName='name'
        dataKeys={['amount']}
        barColors={['#00b6d4']}
      /> */}
    </>
  );
};

export default WithdrawalLanding;
