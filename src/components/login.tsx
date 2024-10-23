// src/LogIn.tsx
import React, { useState } from 'react';
import { auth } from './fierbase'; // Correct the import path if needed
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';

const LogIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to home page after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const redirectToSignUp = () => {
    navigate('/signeup'); // Redirect to the signup page
  };

  return (
    <div className="signup-page-background">
      <div className="screen-1">
        <h2>Log In</h2>
        <div className="email">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login" onClick={handleLogIn}>Log In with Email</button>
        <button className="login" onClick={handleGoogleLogIn}>Log In with Google</button>
        {error && <p>{error}</p>}
        <p style={{ fontWeight: 'bold', fontSize: '18px', color: 'black' }}>
          Don't have an account?{' '}
          <span 
            onClick={redirectToSignUp} 
            style={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold', fontSize: '18px' }}>
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
