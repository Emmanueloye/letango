import { Form } from 'react-router-dom';
import Button from '../UI/Button';

const ContactBox = () => {
  return (
    <div className='pt-8 pb-4 bg-gray-100 dark:bg-slate-700' id='contact'>
      <section>
        {/*=================================================================================
        ========================= Section Title ========================================= */}
        <h1 className='text-3xl mb-10 text-primary-500 font-700 dark:text-slate-50 text-center underline underline-offset-8 decoration-primary-500 dark:decoration-slate-50 capitalize'>
          contact us
        </h1>
        {/*=================================================================================
        ========================= The form box =========================================== */}
        <div className='lg:w-full'>
          <Form className='lg:w-1/2 lg:mx-auto'>
            {/* Full name group */}
            <div className='mb-2'>
              <label
                htmlFor='name'
                className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
              >
                Full name
              </label>
              <input type='text' id='name' name='name' autoComplete='off' />
            </div>
            {/* Email group */}
            <div className='mb-2'>
              <label
                htmlFor='email'
                className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
              >
                Email
              </label>
              <input type='email' id='email' name='email' autoComplete='off' />
            </div>
            {/* Message group */}
            <div className='mb-2'>
              <label
                htmlFor='message'
                className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
              >
                message
              </label>
              <textarea name='message' id='message' rows={5}></textarea>
            </div>
            {/* Button */}
            <Button
              btnText='send'
              btnType={'submit'}
              bg='green-600'
              color='text-white'
            />
          </Form>
        </div>
      </section>
    </div>
  );
};

export default ContactBox;
