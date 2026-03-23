import { Form } from 'react-router-dom';
import Title from '../UI/Title';
import Button from '../UI/Button';

const KYCForm = () => {
  return (
    <section>
      <Form>
        {/* General info section */}
        <Title title='general information' />
        {/* Fullname */}
        <div className='grid lg:grid-cols-2 gap-2'>
          <div className='mb-2'>
            <label
              htmlFor='fullName'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              fullName
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              autoComplete='off'
            />
          </div>
          {/* Email */}
          <div className='mb-2'>
            <label
              htmlFor='email'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              email
            </label>
            <input type='text' id='email' name='email' autoComplete='off' />
          </div>
          {/* Address */}
          <div className='mb-2'>
            <label
              htmlFor='address'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              address
            </label>
            <input type='text' id='address' name='address' autoComplete='off' />
          </div>
          {/* Phone */}
          <div className='mb-2'>
            <label
              htmlFor='phone'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              phone
            </label>
            <input type='text' id='phone' name='phone' autoComplete='off' />
          </div>
          {/* BVN */}
          <div className='mb-2'>
            <label
              htmlFor='BVN'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              BVN
            </label>
            <input type='text' id='BVN' name='BVN' autoComplete='off' />
          </div>
        </div>
        {/* document upload section */}
        <Title title='Documentation' />
        <div className='mb-2'>
          <label
            htmlFor='utilityBill'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            utility bill
          </label>
          <input type='file' id='utilityBill' name='utilityBill' />
        </div>
        <div className='mb-2'>
          <label
            htmlFor='govtId'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            Government ID card
          </label>
          <small>Int'l passport, driver's license etc.</small>
          <input type='file' id='govtId' name='govtId' />
        </div>
        <Button btnText='submit' btnType='submit' />
      </Form>
    </section>
  );
};

export default KYCForm;
