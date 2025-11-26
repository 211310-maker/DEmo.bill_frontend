import React, { useState } from 'react';
import LoginHeader from '../components/LoginHeader';
import { loginApi } from '../utils/api';
import { LOCAL_STORAGE_KEY } from '../constants';
import { useHistory } from 'react-router';

const Login = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setIsLoading(false);
      alert("Please fill all fields");
      return;
    }

    const { data, error } = await loginApi({ username, password });
    setIsLoading(false);

    if (data) {
      if (data.success) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
        setUsername('');
        setPassword('');
        history.push('/');
      } else {
        alert(data.message || "Invalid credentials");
      }
    } else {
      alert(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <LoginHeader />
      <div className="text-center">
        <p className="login-heading">
          <b>VEHICLE TAX PAYMENT</b>
        </p>
      </div>

      <div className="box box--login mt-4">
        <div className="box__heading d-flex a-center j-center py-2">
          Login Here
        </div>

        <form onSubmit={onSubmitHandler} className="form no-capital">
          <div className="form__control">
            <label className="form__label" htmlFor="username">User Name</label>
            <input
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form__input"
              type="text"
              id="username"
            />
          </div>

          <div className="form__control">
            <label className="form__label" htmlFor="password">Password</label>
            <input
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form__input"
              type="password"
              id="password"
            />
          </div>

          <button disabled={isLoading} className="form__submit">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <footer className="footer d-flex j-center a-center p-3">
        All Rights Reserved &copy;
      </footer>
    </>
  );
};

export default Login;
