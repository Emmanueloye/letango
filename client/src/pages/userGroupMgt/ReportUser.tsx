import { Form } from 'react-router-dom';
import Title from '../../components/UI/Title';
import Button from '../../components/UI/Button';

const ReportUser = () => {
  return (
    <section>
      <Form id='reportUser'>
        <Title title='Report User' />
        <div className='mb-2'>
          <label
            htmlFor='fullName'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            fullName
          </label>
          <input type='text' id='fullName' name='fullName' autoComplete='off' />
        </div>
        {/* reference */}
        <div className='mb-2'>
          <label
            htmlFor='userRef'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            user ref/email
          </label>
          <input type='text' id='userRef' name='userRef' autoComplete='off' />
        </div>
        {/* reference */}
        <div className='mb-2'>
          <label
            htmlFor='compliant'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            compliant
          </label>
          <textarea
            name='compliant'
            id='compliant'
            cols={5}
            rows={5}
            autoComplete='off'
            className='resize-y'
          ></textarea>
        </div>
        <Button btnText='send' btnType='submit' />
      </Form>
    </section>
  );
};

export default ReportUser;
