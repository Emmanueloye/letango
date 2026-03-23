import { MdAccountBox } from 'react-icons/md';
import Card from '../components/UI/Card';
import { TbCurrencyNaira } from 'react-icons/tb';
import Chart from '../components/DashboardComponents/Chart';
import { data } from '../assets/tempData/chartData';
import { useOutletContext } from 'react-router-dom';
import { User } from '../dtos/usersDto';

// data type
interface DataType {
  [key: string]: number | string;
}

const Dashboard = () => {
  const user = useOutletContext<User | null>();
  return (
    <section>
      <div className='grid sm:grid-cols-2  gap-2'>
        <Card
          cardDesc='personal wallet'
          balance={user?.personalWallet ?? 0}
          icon={<TbCurrencyNaira />}
        />
        <Card
          cardDesc='account status'
          optionalText='KYC: No data'
          icon={<MdAccountBox />}
        />
      </div>

      <h3 className='py-4  font-600 uppercase '>
        Monthly Contribution Tracker
      </h3>
      <div className='flex gap-2 flex-wrap'>
        <p>PC: Personal contribution</p>
        <p>GC: Group contribution</p>
      </div>
      <Chart
        data={data as DataType[]}
        xAxisName='name'
        dataKeys={['PC', 'GC', 'total']}
        barColors={['#00b6d4', '#00a63e', '#011359']}
      />
    </section>
  );
};

export default Dashboard;
