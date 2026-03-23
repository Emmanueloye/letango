import { TbListDetails } from 'react-icons/tb';
import Card from '../../components/UI/Card';
import { Link } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';

const GroupReportLanding = () => {
  return (
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/manage-group/view/1' />
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <Link to='/account/manage-group/view/1/reports/transaction'>
          <Card cardDesc='Transaction details' icon={<TbListDetails />} />
        </Link>
        <Link to='/account/manage-group/view/1/reports/statement'>
          <Card cardDesc='income and expenses' icon={<TbListDetails />} />
        </Link>
      </div>
    </>
  );
};

export default GroupReportLanding;
