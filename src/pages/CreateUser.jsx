import React, { useState } from 'react';
import Header from '../components/Header';
import { createTempUserApi, provideAccessApi } from '../utils/api';
import copy from 'copy-to-clipboard';
import { fields } from '../constants';
import Select from 'react-select';
const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessLink, setAccessLink] = useState();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [accessState, setAccessState] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [creds, setCreds] = useState({
    username: '',
    password: '',
  });
  const createNewTempUserHandler = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);
    const { data, error } = await createTempUserApi();
    setIsLoading(false);
    if (data) {
      if (data.success) {
        console.log(data);
        setAccessLink(`${window.location.origin}${data.url}`);
        setTempUserId(data.tempUser._id);
        setCreds({
          username: '',
          password: '',
        });
        setOtp('');
        setPassword('');
        setErrorMessage('');
        setSuccessMessage('Access link generated.');
      } else {
        setErrorMessage(data.message || 'Unable to generate access link.');
      }
    } else {
      setErrorMessage(error.message || 'Unable to generate access link.');
    }
  };

  const provideAccessHandler = async () => {
    if (!otp || !password || !username) {
      setErrorMessage('Please fill all fields before submitting.');
      return;
    }
    if (!tempUserId) {
      setErrorMessage('Please generate an access link before submitting the OTP.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const { data, error } = await provideAccessApi({
      otp,
      password,
      tempUserId,
      username,
      accessState:
        accessState.length > 0 ? accessState.map((e) => e.name) : accessState,
    });
    setIsLoading(false);
    if (data) {
      if (data.success) {
        setCreds({
          username,
          password,
        });
        setAccessLink('');
        setOtp('');
        setPassword('');
        setUsername('');
        setAccessState([]);
        setSuccessMessage('User created successfully.');
      } else {
        setErrorMessage(data.message || 'Unable to create user. Please try again.');
      }
    } else if (error) {
      setErrorMessage(error.message || 'Unable to create user. Please try again.');
    } else {
      setErrorMessage('Unable to create user. Please try again.');
    }
  };

  const onCopyHandler = (text) => {
    if (text) {
      copy(text);
    }
  };

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Create User</b>
        </p>
      </div>
      <div className='container mt-4'>
        <button
          disabled={isLoading}
          onClick={createNewTempUserHandler}
          className='btn-primary'
        >
          Create new User{' '}
          <span className='ml-2 glyphicon glyphicon-plus'></span>
        </button>
        <br />
        <br />
        {accessLink && (
          <div style={{ width: '80%', overflowWrap: 'break-word' }}>
            {accessLink}
            <button
              onClick={() => onCopyHandler(accessLink)}
              data-toggle='tooltip'
              data-placement='top'
              title='Copy access link'
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
          </div>
        )}
        {errorMessage && (
          <p className='text-danger font-weight-bold mt-3'>{errorMessage}</p>
        )}
        {successMessage && (
          <p className='text-success font-weight-bold mt-3'>{successMessage}</p>
        )}
        <hr />
        <div className='text-center'>
          <p className='login-heading mt-4'>
            <b>Give Access</b>
          </p>
        </div>
        <div className='form__control'>
          <label className='form__label d-block w-100 text-left' htmlFor='otp'>
            Enter Otp<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='form__input w-100'
            type='text'
            id='otp'
            name='otp'
          />
        </div>
        <div className='form__control'>
          <label
            className='form__label d-block w-100 text-left'
            htmlFor='password'
          >
            Enter username<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='form__input w-100'
            type='text'
            id='username'
            name='username'
          />
        </div>
        <div className='form__control'>
          <label
            className='form__label d-block w-100 text-left'
            htmlFor='password'
          >
            Enter Password<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form__input w-100'
            type='password'
            id='password'
            name='password'
          />
        </div>
        <div className='form__control text-left'>
          <label className='form__label text-left' htmlFor='state'>
            Select State
          </label>
          <Select
            isMulti={true}
            value={accessState}
            onChange={setAccessState}
            options={fields.allState}
            className=''
            placeholder='Select access state'
          />
        </div>
        <br />
        <button
          disabled={isLoading}
          onClick={provideAccessHandler}
          className='btn-success'
        >
          provide access
        </button>

        <br />
        <br />
        <p>
          Generated Username : <u>{creds.username}</u>
        </p>
        <p>Password : {creds.password}</p>
        {creds.username && creds.password && (
          <button
            onClick={() => onCopyHandler(`${creds.username} ${creds.password}`)}
            data-toggle='tooltip'
            data-placement='top'
            title='Copy username and password'
          >
            Copy username & password{' '}
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
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Admin;
