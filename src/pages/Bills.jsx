import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { getAllBillsApi, getAllUsersApi } from '../utils/api';
import { formatDate } from '../utils/helper';
import { fields } from '../constants';
import config from '../config/env';
import { getStoredUser } from '../utils/auth';
const BASE_URL = config['API_BASE_URL'];

const isImageLike = (qrValue) => {
  if (!qrValue) return false;

  const qrString = String(qrValue);

  return (
    qrString.startsWith('data:image') ||
    /\.(png|jpe?g|gif|svg)$/i.test(qrString.split('?')[0])
  );
};

const getQrSource = (bill) => {
  if (!bill) return null;

  const qrValue = bill.qrCode || bill.qrUrl;

  if (!qrValue) return null;

  const qrString = String(qrValue);

  if (isImageLike(qrString)) {
    return { src: qrString, value: qrString };
  }

  const generatedQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    qrString
  )}`;

  return { src: generatedQrSrc, value: qrString };
};
const Bills = () => {
  const isLoggedIn = getStoredUser();
  const [filter, setFilter] = useState({
    state: '',
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState('');
  const [totalBillAmount, setTotalBillAmount] = useState('');
  const [users, setUsers] = useState([]);

  const onChangeHandler = async (e) => {
    const x = { ...filter, [e.target.name]: e.target.value };
    setFilter((old) => ({ ...old, [e.target.name]: e.target.value }));
    const searchParams = new URLSearchParams();

    Object.keys(x).forEach((key) => {
      if (x[key]) {
        searchParams.set(key, x[key]);
      }
    });
    setQuery(searchParams.toString());
  };

  const onSearchHandler = async () => {
    setInitialLoading(true);
    await loadData(query);
  };
  const onResetHandler = async () => {
    setInitialLoading(true);
    const currentUser = getStoredUser();
    loadData(currentUser?.role === 'admin' ? '' : `createdBy=${currentUser?._id || ''}`);
  };

  const loadData = async (params) => {
    const { data, error } = await getAllBillsApi(params);
    setInitialLoading(false);
    if (data?.success) {
      const fetchedBills = Array.isArray(data.bills) ? data.bills : [];
      let amount = 0;
      fetchedBills.forEach((e) => {
        amount += +e.totalAmount;
      });
      setTotalBillAmount(amount);
      setBills(fetchedBills);
    } else {
      alert(data?.message || error?.message || 'Unable to load bills');
    }
  };

  const loadAllUsers = async () => {
    const { data, error } = await getAllUsersApi();
    if (data) {
      setUsers(data.users);
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadData(isLoggedIn?.role === 'admin' ? '' : `createdBy=${isLoggedIn?._id}`);
    if (isLoggedIn?.role === 'admin') {
      loadAllUsers();
    }
  }, [isLoggedIn]);
  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Bills</b>
        </p>
        <br />
        <p className=' mt-4'>
          <b>Total Bills : {bills.length}</b>
          <br />
          <b>Total Amount : {totalBillAmount}</b>
        </p>
      </div>
      <div className='container-fluid mt-5'>
        {initialLoading && (
          <div className='text-center'>
            <Loader />
          </div>
        )}

        {!initialLoading && (
          <>
            {isLoggedIn?.role === 'admin' && (
              <div className='text-center d-flex j-center a-center'>
                <div>
                  <b>User :</b>
                  <select
                    className='mr-2'
                    name='createdBy'
                    value={filter.createdBy}
                    onChange={onChangeHandler}
                  >
                    <option value=''>Select User</option>
                    {users.map((user) => {
                      return <option value={user._id}>{user.username}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <b>State :</b>
                  <select
                    className='mr-2'
                    name='state'
                    value={filter.state}
                    onChange={onChangeHandler}
                  >
                    <option value=''>Select State</option>
                    {fields.allState.map((state) => {
                      return <option value={state.value}>{state.name}</option>;
                    })}
                  </select>
                </div>
                <button
                  className='btn-primary ml-2 mr-2'
                  onClick={onSearchHandler}
                >
                  search
                </button>
                <button className=' btn-danger' onClick={onResetHandler}>
                  Reset
                </button>
              </div>
            )}
            <br />
            <table className='table table-striped'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Receipt No</th>
                  <th scope='col'>QR Code</th>
                  <th scope='col'>Vehicle Category</th>
                  <th scope='col'>Regis No.</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>State</th>
                  <th scope='col'>Receipt State</th>
                  <th scope='col'>Tax Period</th>
                  <th scope='col'>Tax From Date</th>
                  <th scope='col'>Tax To Date</th>
                  <th scope='col'>Mobile No.</th>
                  <th scope='col'>User Charges</th>
                  <th scope='col'>Tax Amount</th>
                  <th scope='col'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bills.length == 0 && (
                  <tr>
                    <td className='text-center' colSpan='14'>
                      <h3>No data</h3>
                    </td>
                  </tr>
                )}
                {bills.map((bill, i) => {
                  const qrInfo = getQrSource(bill);
                  return (
                    <tr key={bill._id}>
                      <td>
                        {bill?._id ? (
                          <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={`${BASE_URL}/bill/${bill._id}/pdf`}
                          >
                            {bill.receiptNo || bill._id}
                          </a>
                        ) : (
                          bill?.receiptNo || '-'
                        )}
                      </td>
                      <td>
                        {qrInfo ? (
                          <div className='qr-cell'>
                            <img
                              src={qrInfo.src}
                              alt='Bill QR'
                              className='qr-image'
                            />
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td scope='row'>{bill?.vehicleClass}</td>
                      <td>{bill?.vehicleNo}</td>
                      <td>{bill?.ownerName}</td>
                      <td>{bill?.fromState}</td>
                      <td>{bill?.state}</td>
                      <td scope='row'>{bill?.taxMode}</td>
                      <td>{formatDate(bill?.taxFromDate, false)}</td>
                      <td>{formatDate(bill?.taxUptoDate, false)}</td>
                      <td scope='row'>{bill?.mobileNo}</td>
                      <td scope='row'>-</td>
                      <td scope='row'>{bill?.totalAmount}</td>
                      <td>
                        {bill?._id && (
                          <div className='d-flex flex-column'>
                            <a
                              target='_blank'
                              rel='noopener noreferrer'
                              href={`${BASE_URL}/bill/${bill._id}/pdf`}
                            >
                              View PDF
                            </a>
                            <a
                              target='_blank'
                              rel='noopener noreferrer'
                              href={`${BASE_URL}/bill/${bill._id}/page`}
                            >
                              Open Page
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        <br />
        <br />
      </div>
    </>
  );
};

export default Bills;
