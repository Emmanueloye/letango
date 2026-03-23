import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { customFetch } from '../../helperFunc.ts/apiRequest';
import axios from 'axios';
import LinkBtn from '../../components/UI/LinkBtn';

const VerifyEmail = () => {
  const [verificationMessage, setVerificationMessage] = useState({
    success: false,
    message: '',
  });
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = Object.fromEntries(searchParams);
        const response = await customFetch.post('/auth/verify-email', params);
        setLoading(false);

        setVerificationMessage({ ...response.data });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setLoading(false);
          setVerificationMessage({
            success: false,
            message: error.response?.data?.message || 'Verification failed',
          });
        }
      }
    };
    verifyEmail();
  }, [searchParams]);

  return (
    <section className='mx-auto dark:text-white'>
      {loading ? (
        <div className='flex flex-col items-center justify-center mt-[100px]'>
          <p className='text-green-600'>Verifying your email...</p>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center mt-[100px]'>
          <h2 className='font-600 mb-2'>Email Verification</h2>
          {!verificationMessage.success ? (
            <>
              <h2 className='text-rose-600 mb-3'>
                ❌ {verificationMessage.message}
              </h2>
              <p className='text-sm'>
                If you are getting this message, this could be because of the
                following reasons:
              </p>
              <ul className='list-disc text-sm'>
                <li className='mt-2'>Your email has already been verified</li>
                <li className='mt-2'>
                  You are not using the verification link sent to your email
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className='text-green-600 mb-3'>
                🎉🎉 {verificationMessage.message} 🎉🎉
              </p>
              <LinkBtn btnText='Login' url='/login' />
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default VerifyEmail;
