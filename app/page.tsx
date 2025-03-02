'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      return 'Username must contain only letters';
    }
    return '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setUsernameError('');
    setPasswordError('');

    // Validate username
    const userError = validateUsername(username);
    if (userError) {
      setUsernameError(userError);
      return;
    }

    // Validate password (just check if it's not empty for this fake login)
    if (!password) {
      setPasswordError('Wrong password, try again');
      return;
    }

    // If validation passes, redirect to shift page with username
    router.push(`/shift?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl text-center">Shift Hub Login</h1>
          <form onSubmit={handleSubmit} className="form-control w-full gap-4 mt-4">
            <div>
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`input input-bordered w-full ${usernameError ? 'input-error' : ''}`}
              />
              {usernameError && (
                <label className="label">
                  <span className="label-text-alt text-error">{usernameError}</span>
                </label>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`input input-bordered w-full ${passwordError ? 'input-error' : ''}`}
              />
              {passwordError && (
                <label className="label">
                  <span className="label-text-alt text-error">{passwordError}</span>
                </label>
              )}
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
