import React, { useState } from 'react';
import Header from '../components/Header';
import Select from 'react-select';
import { fields } from '../constants';
import { createUserApi } from '../utils/api';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessState, setAccessState] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmitHandler = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Please fill all required fields.');
      return;
    }

    setIsLoading(true);
    const { data, error } = await createUserApi({
      username,
      password,
      accessState: accessState.map((state) => state.name),
    });
    setIsLoading(false);

    if (data) {
      if (data.success) {
        setSuccessMessage('User created successfully.');
        setUsername('');
        setPassword('');
        setAccessState([]);
      } else {
        setErrorMessage(data.message || 'Unable to create user.');
      }
    } else {
      setErrorMessage(error?.message || 'Unable to create user.');
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
        {errorMessage && (
          <p className='text-danger font-weight-bold mt-3'>{errorMessage}</p>
        )}
        {successMessage && (
          <p className='text-success font-weight-bold mt-3'>{successMessage}</p>
        )}
        <div className='form__control'>
          <label className='form__label d-block w-100 text-left' htmlFor='username'>
            Username<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='form__input w-100'
            type='text'
            id='username'
            name='username'
            disabled={isLoading}
          />
        </div>
        <div className='form__control'>
          <label className='form__label d-block w-100 text-left' htmlFor='password'>
            Password<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form__input w-100'
            type='password'
            id='password'
            name='password'
            disabled={isLoading}
          />
        </div>
        <div className='form__control text-left'>
          <label className='form__label text-left' htmlFor='state'>
            Select State Access
          </label>
          <Select
            isMulti={true}
            value={accessState}
            onChange={setAccessState}
            options={fields.allState}
            className=''
            placeholder='Select access state'
            isDisabled={isLoading}
          />
        </div>
        <br />
        <button disabled={isLoading} onClick={onSubmitHandler} className='btn-success'>
          {isLoading ? 'Creating...' : 'Create user'}
        </button>
      </div>
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
