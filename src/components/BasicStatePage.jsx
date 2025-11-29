import React from 'react';
import Header from './Header';
import { fields } from '../constants';
import { getAccessStates, getStoredUser } from '../utils/auth';

const BasicStatePage = ({ stateKey, heading }) => {
  const user = getStoredUser();
  const accessStates = getAccessStates(user);
  const hasAccess =
    accessStates.includes(fields.stateName[stateKey]) || accessStates.includes(stateKey);

  if (!hasAccess) {
    return (
      <>
        <Header />
        <div className='container text-center mt-4 '>
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='container text-center mt-4 '>
        <h3>{heading} border tax workflow</h3>
        <p>Please continue using the dedicated process for this state.</p>
      </div>
    </>
  );
};

export default BasicStatePage;
