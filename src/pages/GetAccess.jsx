import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import { getAcessApi } from '../utils/api';

const GetAccess = () => {
  const { id, token } = useParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const accessToken = useMemo(() => id || token, [id, token]);

  useEffect(() => {
    if (!accessToken) {
      setErrorMessage('Missing access token.');
      return;
    }

    const onGetAccessHandler = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setStatusMessage('');

      const { data, error } = await getAcessApi(accessToken);

      if (data?.success && data?.otp) {
        setOtp(data.otp);
        setStatusMessage('Share this OTP with the admin to complete user creation.');
      } else {
        setErrorMessage(
          data?.message || error?.message || 'Unable to process access link. Please try again.'
        );
      }

      setIsLoading(false);
    };

    onGetAccessHandler();
  }, [accessToken]);

  const onCopyHandler = (text) => {
    if (text) {
      copy(text);
    }
  };

  return (
    <div className='container'>
      <div className='text-center mt-5 pt-4'>
        <h3>Get Access</h3>
        {statusMessage && (
          <p className='text-info font-weight-bold mt-3'>{statusMessage}</p>
        )}
        {errorMessage && <p className='text-danger font-weight-bold mt-3'>{errorMessage}</p>}
        {isLoading && <p className='mt-3'>Generating OTP...</p>}
      </div>

      {!isLoading && otp && (
        <div className='text-center mt-4'>
          <p className='text-info'>Provide this code to the admin handling your account.</p>
          <h4 className='text-center'>
            <span className='text-danger'>ACCESS CODE</span> : {otp}{' '}
            <button
              onClick={() => onCopyHandler(otp)}
              data-toggle='tooltip'
              data-placement='top'
              title='Copy otp'
              className='btn btn-sm ml-3'
            >
              <svg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2 9a7 7 0 0 1 7-7h8a1 1 0 1 1 0 2H9a5 5 0 0 0-5 5v8a1 1 0 1 1-2 0V9z'
                  fill='#0C6090'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M6 11a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-6zm5-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-6z'
                  fill='#0C6090'
                />
              </svg>
            </button>
          </h4>
        </div>
      )}
    </div>
  );
};

export default GetAccess;
