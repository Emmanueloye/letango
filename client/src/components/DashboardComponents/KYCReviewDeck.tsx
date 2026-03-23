import Title from '../UI/Title';
import Button from '../UI/Button';

const KYCReviewDeck = () => {
  return (
    <section>
      {/* General info section */}
      <Title title='general information' />

      <div className='mb-6 border-b-2 border-green-500 pb-3'>
        <select name='isApproved' id='isApproved'>
          <option value='' hidden>
            Select decision
          </option>
          <option value=''>Approve</option>
          <option value=''>Reject</option>
        </select>
      </div>
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
            defaultValue={'osunkoya mayowa'}
            disabled
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
          <input
            type='text'
            id='email'
            name='email'
            autoComplete='off'
            defaultValue={'mayorjson@gmail.com'}
            disabled
          />
        </div>
        {/* Phone */}
        <div className='mb-2'>
          <label
            htmlFor='phone'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            phone
          </label>
          <input
            type='text'
            id='phone'
            name='phone'
            autoComplete='off'
            defaultValue={'08100010000'}
            disabled
          />
        </div>
        {/* BVN */}
        <div className='mb-2'>
          <label
            htmlFor='BVN'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            BVN
          </label>
          <input
            type='text'
            id='BVN'
            name='BVN'
            autoComplete='off'
            defaultValue={'9393939393939'}
            disabled
          />
        </div>
        {/* Address */}
        <div className='mb-2'>
          <label
            htmlFor='address'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            address
          </label>
          <textarea
            id='address'
            cols={5}
            rows={5}
            autoComplete='off'
            defaultValue={
              '18, mayasondo street, off mayor junction, Ogba, Lagos'
            }
            disabled
          ></textarea>
        </div>
      </div>
      {/* document download section */}
      <Title title='Documentation' />
      <div className='mb-2 flex justify-between md:grid md:grid-cols-3 items-center flex-wrap'>
        <p
          className={`label after:text-red-500 after:content-['*'] after:font-700 text-sm`}
        >
          utility bill
        </p>

        <p className='capitalize text-sm font-500'>document name</p>
        <div>
          <Button btnText='download' btnType='button' />
        </div>
      </div>
      {/* document download section */}
      <div className='mb-2 flex justify-between md:grid md:grid-cols-3 items-center flex-wrap'>
        <p
          className={`label after:text-red-500 after:content-['*'] after:font-700 text-sm`}
        >
          Government ID
        </p>

        <p className='capitalize text-sm font-500'>document name</p>
        <div>
          <Button btnText='download' btnType='button' />
        </div>
      </div>
    </section>
  );
};

export default KYCReviewDeck;
