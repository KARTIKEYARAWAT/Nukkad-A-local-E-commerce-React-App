import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './globals.css';

const Signup = () => {
  const [signupWithEmail, setSignupWithEmail] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  const handleSignup = async () => {
    setError('');

    if (signupWithEmail && !email) {
      return setError('Email is required.');
    }

    if (!signupWithEmail && !phone) {
      return setError('Phone number is required.');
    }

    if (!strongPassword.test(password)) {
      return setError('Password must be 8+ characters, with uppercase, lowercase, number, and special char.');
    }

    if (password !== confirmPassword) {
      return setError("Passwords don't match.");
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email: signupWithEmail ? email : null,
        phone: signupWithEmail ? null : phone,
        password,
      });

      if (res.data.message) {
        alert('Account created successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Email or phone might already be registered.');
    }
  };

  return (
    <div className="login-box">
      <h2>Signup</h2>

      {/* Toggle Email/Phone signup mode */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setSignupWithEmail(true)}
          style={{
            marginRight: '5px',
            backgroundColor: signupWithEmail ? '#ff6600' : '#ddd',
            color: signupWithEmail ? '#fff' : '#000',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
          }}
        >
          Use Email
        </button>
        <button
          onClick={() => setSignupWithEmail(false)}
          style={{
            backgroundColor: !signupWithEmail ? '#ff6600' : '#ddd',
            color: !signupWithEmail ? '#fff' : '#000',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
          }}
        >
          Use Phone
        </button>
      </div>

      {signupWithEmail ? (
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      ) : (
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      )}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
      <div className="error-message">{error}</div>
    </div>
  );
};

export default Signup;
