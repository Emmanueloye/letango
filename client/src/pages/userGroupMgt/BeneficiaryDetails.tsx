import { ChangeEvent, useState } from 'react';
import Button from '../../components/UI/Button';
import { FaTrash } from 'react-icons/fa';
import LinkBtn from '../../components/UI/LinkBtn';

type BeneficiaryType = {
  accountName: string;
  accountNumber: string;
};

const BeneficiaryDetails = () => {
  const [beneficiary, setBeneficiary] = useState([
    {
      accountName: '',
      accountNumber: '',
    },
  ]);

  const handleAdd = () => {
    setBeneficiary([...beneficiary, { accountName: '', accountNumber: '' }]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const { name, value } = e.target;
    const changedData = [...beneficiary];
    changedData[i][name as keyof BeneficiaryType] = value;
    setBeneficiary(changedData);
  };

  const handleDelete = (i: number) => {
    const deleteValue = [...beneficiary];
    deleteValue.splice(i, 1);
    setBeneficiary(deleteValue);
  };

  const handleSubmit = () => {};

  return (
    <div>
      <div className='flex justify-between items-center flex-wrap'>
        <div className='w-full md:w-[150px] mb-4'>
          <Button
            btnText='add beneficiary'
            btnType='button'
            onTrigger={handleAdd}
          />
        </div>

        <LinkBtn btnText='back' url='/account/manage-group/view/1' />
      </div>
      {beneficiary.map((item, i) => (
        <div
          className='sm:flex sm:gap-3 sm:flex-nowrap  items-center mt-3'
          key={i}
        >
          <div className='w-full'>
            <label htmlFor={`accountName${i}`}>account name</label>
            <input
              id={`accountName${i}`}
              name='accountName'
              value={item.accountName}
              onChange={(e) => handleChange(e, i)}
            />
          </div>
          <div className='w-full'>
            <label htmlFor={`accountNumber${i}`}>account number</label>
            <input
              id={`accountNumber${i}`}
              name='accountNumber'
              value={item.accountNumber}
              onChange={(e) => handleChange(e, i)}
            />
          </div>
          <div>
            <button
              className='flex justify-center items-center mt-3 bg-amber-600 text-slate-50 font-600 hover:bg-amber-400 px-3 py-2 rounded-md w-full capitalize sm:mt-6'
              onClick={() => handleDelete(i)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
      <div className='mt-6'>
        <Button btnText='submit' btnType='submit' onTrigger={handleSubmit} />
      </div>
    </div>
  );
};

export default BeneficiaryDetails;
