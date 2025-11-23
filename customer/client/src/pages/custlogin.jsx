// src/pages/CustLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './globals.css';

const CustLogin = () => {
  const [useOTP, setUseOTP] = useState(false);
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let errs = {};
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPhone) errs.email = 'This field is required.';
    else if (!phoneRegex.test(emailPhone) && !emailRegex.test(emailPhone))
      errs.email = 'Enter valid email or 10-digit phone.';

    if (useOTP) {
      if (!otp) errs.otp = 'OTP is required.';
    } else {
      if (!password) errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setServerError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        emailOrPhone: emailPhone,
        password: useOTP ? null : password,
        otp: useOTP ? otp : null,
      });

      if (res.data.success) {
        navigate('/custhome');
      } else {
        setServerError(res.data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setServerError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-box">
      <h2>User Login</h2>

      <input
        type="text"
        placeholder="Email or Phone"
        value={emailPhone}
        onChange={e => setEmailPhone(e.target.value)}
      />
      <div className="error-message">{errors.email}</div>

      {!useOTP ? (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="error-message">{errors.password}</div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <div className="error-message">{errors.otp}</div>
        </>
      )}

      <button onClick={handleLogin}>Login</button>
      <span className="toggle-mode" onClick={() => setUseOTP(!useOTP)}>
        Login using <span>{useOTP ? 'Password' : 'OTP'}</span>
      </span>

      <div className="error-message">{serverError}</div>

      <div className="bottom-link">
        Don't have an account?{' '}
        <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
          Signup
        </a>
      </div>
    </div>
  );
};
export default CustLogin;