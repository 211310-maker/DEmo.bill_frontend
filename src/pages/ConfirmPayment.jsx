import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import SbiLogo from '../assets/SBI_LOGO.png';
import veriSign from '../assets/VERISIGN.png';
import config from '../config/env';
import { createBillApi } from '../utils/api';

const ConfirmPayment = () => {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [createdBill, setCreatedBill] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const formData = location?.state?.formData;

  const createBill = async () => {
    if (!formData) return;
    setIsLoading(true);
    const { data, error } = await createBillApi({ ...formData });
    setIsLoading(false);

    if (data?.success) {
      const created = data.bill || data.createdBill || data.data || null;
      const pdfUrl = data.pdfUrl || created?.pdfUrl;
      setCreatedBill(created ? { ...created, pdfUrl: pdfUrl || created.pdfUrl } : null);
      setStatusMessage('Bill created successfully');
    } else {
      setStatusMessage(data?.message || error?.message || 'Unable to create bill.');
    }
  };

  useEffect(() => {
    if (!formData) {
      history.replace('/');
      return;
    }
    createBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <br />
      <div className='payBox container'>
        <div className='row'>
          <div className='col-sm-6'>
            <img src={SbiLogo} className='' />
          </div>
          <div className='col-sm-6'></div>
        </div>
        <div className='payBox__top'></div>
        <div className='payBox__center'>
          <p className='ml-4 my-4'>
            <b>Login</b>
          </p>
          <div className='no-capital'>
            <div className='payBox__inner py-5'>
              <div className='form__control'>
                <label className='form__label' htmlFor='username'>
                  Username
                </label>
                <input
                  tabIndex='1'
                  disabled
                  className='form__input'
                  type='text'
                  id='username'
                  value=''
                  placeholder='Not required for this step'
                />
              </div>
              <div className='form__control'>
                <label className='form__label' htmlFor='password'>
                  Password
                </label>
                <input
                  tabIndex='2'
                  disabled
                  className='form__input'
                  type='password'
                  id='password'
                  minLength='5'
                  value=''
                  placeholder='Not required for this step'
                />
              </div>
              <div className='text-center pl-4'>
                <button
                  disabled={isLoading}
                  type='button'
                  className='mr-3 btn-primary'
                  onClick={createBill}
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
                <button
                  disabled={isLoading}
                  type='button'
                  className='btn-danger'
                  onClick={() => history.push('/')}
                >
                  Reset
                </button>
              </div>
              {statusMessage && (
                <p className='text-center mt-3'>{statusMessage}</p>
              )}
              {createdBill?.pdfUrl && (
                <div className='text-center pl-4 mt-3'>
                  <a
                    className='btn-primary'
                    href={createdBill.pdfUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Download Receipt
                  </a>
                </div>
              )}
              {createdBill?._id && !createdBill.pdfUrl && (
                <div className='text-center pl-4 mt-3'>
                  <a
                    className='btn-primary'
                    href={`${config.API_BASE_URL}/bill/${createdBill._id}/pdf`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Download Receipt
                  </a>
                </div>
              )}

              <div className='text-center mt-4'>
                <a href=''>FAQ</a> <span className='mx-2'>|</span>
                <a href=''>About Phising</a>
              </div>
              <p className='text-center mt-3'>
                <a href=''>
                  <u>Click here</u>
                </a>{' '}
                to about this transaction and return to the One97 Commincations
                Limited site.
              </p>
              <div className='d-flex j-center a-center'>
                <img src={veriSign} className='mr-2' height='35' alt='' />
                <p className='p-0 m-0 mt-2'>
                  This site uses highly secure 256-bit encryption certified by
                  verisign.
                </p>
              </div>
              <div className='d-flex j-center a-center mt-3'>
                <p className='disclaimer text-left'>
                  <span className='text-danger mr-1'>
                    <b>Disclaimer</b>:
                  </span>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Tenetur consectetur obcaecati inventore corporis <br /> quae
                  magni non, quos a iusto ab distinctio illum dolor vitae,
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className=''>
          <div className='payBox__bottom py-3'>
            <ul>
              <li>Mandatory fields are marked by asterisk (*)</li>
              <li>
                Do not provide your username and password anywhere in this page
              </li>
              <li>
                Your username & password are highly confidential. Never part
                with them. SBI will never ask for this information{' '}
              </li>
            </ul>
          </div>
        </div>
        <br />
        <br />
      </div>
    </>
  );
};

export default ConfirmPayment;
