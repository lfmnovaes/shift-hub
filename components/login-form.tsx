'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, KeyIcon, EyeOnIcon, EyeOffIcon } from '@/assets';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userError = validateUsername(username);
    const passError = validatePassword(password);
    setUsernameError(userError);
    setPasswordError(passError);
    if (userError || passError) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error?._errors) {
          const errorMessage = data.error._errors[0];
          toast.error(errorMessage);
        } else {
          toast.error('Login failed. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }
      toast.success(`Welcome back, ${data.user.username}!`);
      router.push('/shift');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-control w-full gap-4 mt-4">
      <div>
        <label className="input validator w-full">
          <UserIcon className="h-[1em] text-gray-600" />
          <input
            type="input"
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
          {passwordError || 'Enter your password'}
        </p>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <div className="text-center">
          <Link href="/register" className="link link-hover text-sm">
            Don&apos;t have an account? Register now
          </Link>
        </div>
      </div>
    </form>
  );
}
