import { Form } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Title from '../../components/UI/Title';
import LinkBtn from '../../components/UI/LinkBtn';

const CreateGroupRules = () => {
  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      <div>
        <LinkBtn btnText='Back' url='/account/manage-group/view/1' />
      </div>
      {/* Form title */}
      <Title title='manage group rules' />
      <Form id='manageRules'>
        {/* Group name input */}
        <div className='mb-6'>
          <label
            htmlFor='groupName'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            group Rules
          </label>
          <textarea name='rules' id='rules' cols={10} rows={10}></textarea>
        </div>

        <Button btnText='save' btnType='submit' />
      </Form>
    </div>
  );
};

export default CreateGroupRules;
