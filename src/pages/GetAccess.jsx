import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getAcessApi } from '../utils/api';
import { LOCAL_STORAGE_KEY } from '../constants';
import copy from 'copy-to-clipboard';

const GetAccess = () => {
  const history = useHistory();
  const { token } = useParams();
  const [otp, setOtp] = useState('');
  const [_, setCookie] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setIsInvalid(true);
      setMessage('Missing access token.');
      return;
    }

    const onGetAccessHandler = async () => {
      setIsLoading(true);
      const { data } = await getAcessApi(token);

      if (data && data.success) {
        if (data.user) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
          setSuccess(true);
          setMessage('Access granted. Redirecting you to the dashboard...');
          setTimeout(() => history.push('/'), 1200);
        } else if (data.pageAccessToken && data.otp) {
          setCookie('pageAccessToken', data.pageAccessToken, { path: '/' });
          setOtp(data.otp);
          setSuccess(true);
          setMessage(
            'Access code generated. Please share the code with the admin to complete setup.'
          );
        } else {
          setIsInvalid(true);
          setMessage(data.message || 'Unable to process access link.');
        }
      } else {
        setIsInvalid(true);
        setMessage(data?.message || 'Link expired or invalid.');
      }

      setIsLoading(false);
    };

    onGetAccessHandler();
  }, [history, setCookie, token]);

  const onCopyHandler = (text) => {
    if (text) {
      copy(text);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <div className='container'>
        {isLoading && <></>}
        {message && (
          <p className='text-center text-info'>
            <b>{message}</b>
          </p>
        )}
        {!isLoading && !isInvalid && success && otp && (
          <>
            <br />
            <br />
            <p className='text-info text-center'>
              <b>
                <span className='text-danger mr-3'>
                  <u>Note</u>
                  <sup>*</sup>
                </span>{' '}
                Please copy the access code & send to the admin.
              </b>
            </p>
          </>
        )}
        {!isLoading && !isInvalid && otp && (
          <>
            <br />
            <h4 className='text-center'>
              <span className='text-danger'>ACCESS CODE </span> : {otp}{' '}
              <button
                onClick={() => onCopyHandler(otp)}
                data-toggle='tooltip'
                data-placement='top'
                title='Copy otp'
                className='btn btn-sm ml-3'
              >
                <svg
                  width='24'
                  height='24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M2 9a7 7 0 0 1 7-7h8a1 1 0 1 1 0 2H9a5 5 0 0 0-5 5v8a1 1 0 1 1-2 0V9z'
                    fill='#0C6090'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M6 11a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-6zm5-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-6z'
                    fill='#0C6090'
                  />
                </svg>
              </button>
            </h4>
          </>
        )}
        {!isLoading && isInvalid && (
          <>
            <br />
            <br />
            <h4 className='text-center'>Link Expired</h4>
          </>
        )}
      </div>
    </div>
  );
};

export default GetAccess;
