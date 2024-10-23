// src/SignUp.tsx
import React, { useState } from 'react';
import { auth } from './fierbase'; // Correct the import path if needed
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './login.css'; // Import the CSS file

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or show success message
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect or show success message
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page-background"> {/* This div will hold the background */}
      <div className="screen-1">
        <h2>Sign Up</h2>
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
        <button className="login" onClick={handleSignUp}>Sign Up with Email</button>
        <button className="login" onClick={handleGoogleSignUp}>Sign Up with Google</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
