import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router-dom';
import defaultUser from '../../assets/user-2935527_1280.webp';
import { useState } from 'react';
import Button from '../UI/Button';
import { User } from '../../dtos/usersDto';
import FormError from '../UI/FormError';

const UpdateProfileForm = () => {
  const user = useOutletContext() as User;
  const [image, setImage] = useState(user?.photo || defaultUser);
  const { state } = useNavigation();
  const error = useActionData();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <article className='w-11/12 bg-gray-100 dark:bg-slate-800 container mx-auto lg:py-2 px-3 shadow-lg'>
      {/* Header */}
      <h3 className='border-b-2 py-4 mb-8 font-600 uppercase text-center border-b-green-500'>
        Update Profile
      </h3>
      <Form id='form' method='PATCH' encType='multipart/form-data'>
        {error && <FormError message={error?.message} />}
        <div className='grid lg:grid-cols-2 gap-3'>
          {/* Surname group */}
          <div className='mb-2'>
            <label
              htmlFor='surname'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Surname
            </label>
            <input
              type='text'
              id='surname'
              name='surname'
              autoComplete='off'
              defaultValue={user.surname}
              className='capitalize'
            />
          </div>
          {/* Other names group */}
          <div className='mb-2'>
            <label
              htmlFor='otherNames'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Other names
            </label>
            <input
              type='text'
              id='otherNames'
              name='otherNames'
              autoComplete='off'
              defaultValue={user.otherNames}
              className='capitalize'
            />
          </div>
          {/* Email group */}
          <div className='mb-2'>
            <label
              htmlFor='email'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
            >
              email
            </label>
            <input
              type='text'
              id='email'
              name='email'
              autoComplete='off'
              defaultValue={user.email}
              disabled
            />
          </div>
          {/* files group */}
          <div className='mb-2'>
            <label
              htmlFor='photo'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
            >
              Profile Photo
            </label>
            <input
              type='file'
              id='photo'
              name='photo'
              autoComplete='off'
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className='flex justify-center mb-3'>
          <img
            src={image}
            alt='User image preview'
            width={80}
            height={80}
            className='rounded-full mt-3'
          />
        </div>
        <Button
          btnText={state === 'submitting' ? 'Saving' : 'Save'}
          btnType='submit'
          disabled={state === 'submitting'}
        />
      </Form>
    </article>
  );
};

export default UpdateProfileForm;
