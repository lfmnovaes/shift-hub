'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, KeyIcon, EyeOnIcon, EyeOffIcon } from '@/assets';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateUsername = (value: string) => {
    if (!value) {
      return 'Username is required';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z][a-zA-Z\-_]*$/.test(value)) {
      return 'Only letters, dash or underscore allowed';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 3) {
      return 'Password must be at least 3 characters';
    }
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const userError = validateUsername(username);
    const passError = validatePassword(password);
    const confirmPassError = validateConfirmPassword(confirmPassword);

    setUsernameError(userError);
    setPasswordError(passError);
    setConfirmPasswordError(confirmPassError);

    if (userError || passError || confirmPassError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.username) {
          const errorMessage = data.error.username[0];
          setUsernameError(errorMessage);
          toast.error(errorMessage);
          console.error('Registration failed:', errorMessage);
        } else if (data.error?._errors) {
          const errorMessage = data.error._errors[0];
          setGeneralError(errorMessage);
          toast.error(errorMessage);
          console.error('Registration failed:', errorMessage);
        } else {
          setGeneralError('Registration failed. Please try again.');
          toast.error('Registration failed. Please try again.');
          console.error('Registration failed:', data.error);
        }
        setIsSubmitting(false);
        return;
      }
      toast.success('Registration successful! You can now log in.');
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Create an Account</h2>
          {generalError && (
            <div className="alert alert-error">
              <span>{generalError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-control w-full gap-4 mt-4">
            <div>
              <label className="input validator w-full">
                <UserIcon className="h-[1em] text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  placeholder="Username"
                  pattern="[A-Za-z][A-Za-z\-_]*"
                  minLength={3}
                  maxLength={30}
                  title="Only letters, dash or underscore allowed"
                  disabled={isSubmitting}
                />
              </label>
              <p className={`h-6 validator-hint ${usernameError ? 'text-error' : ''}`}>
                {usernameError || 'Only letters, dash or underscore allowed'}
              </p>
            </div>
            <div>
              <label className="input validator w-full">
                <KeyIcon className="h-[1em] text-gray-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Password"
                  minLength={3}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-[1.2em] text-gray-600" />
                  ) : (
                    <EyeOnIcon className="h-[1.2em] text-gray-600" />
                  )}
                </button>
              </label>
              <p className={`h-6 validator-hint ${passwordError ? 'text-error' : ''}`}>
                {passwordError || 'At least 3 characters'}
              </p>
            </div>
            <div>
              <label className="input validator w-full">
                <KeyIcon className="h-[1em] text-gray-600" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  placeholder="Confirm Password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-[1.2em] text-gray-600" />
                  ) : (
                    <EyeOnIcon className="h-[1.2em] text-gray-600" />
                  )}
                </button>
              </label>
              <p className={`h-6 validator-hint ${confirmPasswordError ? 'text-error' : ''}`}>
                {confirmPasswordError || 'Confirm your password'}
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
              <div className="text-center">
                <Link href="/" className="link link-hover text-sm">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
