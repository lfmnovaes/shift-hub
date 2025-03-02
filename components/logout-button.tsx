'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        // Redirect to home page
        router.push('/');
      } else {
        toast.error('Failed to log out');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred while logging out');
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`btn btn-primary ${isLoggingOut ? 'loading' : ''}`}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
