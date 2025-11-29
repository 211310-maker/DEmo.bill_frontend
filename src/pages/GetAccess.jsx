import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { provideAccessApi, getAcessApi } from '../utils/api';
import { saveSession } from '../utils/auth';

const GetAccess = () => {
  const history = useHistory();
  const { token } = useParams();

  const [form, setForm] = useState({
    name: '',
    mobileNo: '',
    password: '',
    otp: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!token) return;
      setIsLoading(true);
      const { data, error } = await getAcessApi(token);
      setIsLoading(false);
      if (data?.success) {
        setStatusMessage('OTP sent to your mobile');
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        }
      } else {
        setStatusMessage(data?.message || error?.message || 'Invalid or expired link');
      }
    };

    init();
  }, [token]);

  const onChangeHandler = (e) => {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!token) return;
    setStatusMessage('');
    setIsVerifying(true);
    const { data, error } = await provideAccessApi({ token, ...form });
    setIsVerifying(false);

    if (data?.success) {
      setStatusMessage('OTP verified, account created');
      if (data.user && data.token) {
        saveSession(data.token, data.user);
        history.push('/');
      } else {
        history.push('/admin/users');
      }
    } else {
      setStatusMessage(data?.message || error?.message || 'Unable to verify OTP');
    }
  };

  return (
    <div className='container'>
      <div className='text-center mt-5 pt-4'>
        <h3>Get Access</h3>
        {statusMessage && (
          <p className='text-info font-weight-bold mt-3'>{statusMessage}</p>
        )}
        {devOtp && (
          <p className='text-muted'>Dev OTP: {devOtp}</p>
        )}
      </div>
      <div className='container mt-4'>
        <form onSubmit={onSubmitHandler}>
          <div className='form__control'>
            <label className='form__label d-block w-100 text-left' htmlFor='name'>
              Name
            </label>
            <input
              required
              disabled={isLoading || isVerifying}
              value={form.name}
              onChange={onChangeHandler}
              className='form__input w-100'
              type='text'
              id='name'
              name='name'
            />
          </div>
          <div className='form__control'>
            <label className='form__label d-block w-100 text-left' htmlFor='mobileNo'>
              Mobile No
            </label>
            <input
              required
              disabled={isLoading || isVerifying}
              value={form.mobileNo}
              onChange={onChangeHandler}
              className='form__input w-100'
              type='tel'
              id='mobileNo'
              name='mobileNo'
            />
          </div>
          <div className='form__control'>
            <label className='form__label d-block w-100 text-left' htmlFor='password'>
              Password
            </label>
            <input
              required
              disabled={isLoading || isVerifying}
              value={form.password}
              onChange={onChangeHandler}
              className='form__input w-100'
              type='password'
              id='password'
              name='password'
            />
          </div>
          <div className='form__control'>
            <label className='form__label d-block w-100 text-left' htmlFor='otp'>
              OTP
            </label>
            <input
              required
              disabled={isLoading || isVerifying}
              value={form.otp}
              onChange={onChangeHandler}
              className='form__input w-100'
              type='text'
              id='otp'
              name='otp'
            />
          </div>
          <button
            disabled={isLoading || isVerifying}
            type='submit'
            className='btn-success'
          >
            {isVerifying ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetAccess;
