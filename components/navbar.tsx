'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@/assets';

interface NavbarProps {
  username: string;
  userId: number;
}

export default function Navbar({ username, userId }: NavbarProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-md">
      <div className="container mx-auto flex justify-between">
        <div className="flex-1">
          <Link href="/shift" className="btn btn-ghost text-xl font-bold">
            Shift Hub
          </Link>
        </div>
        <div className="flex-none ml-auto">
          <div className="dropdown dropdown-end" ref={menuRef}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-sm md:btn-md w-[150px] justify-between"
            >
              <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="truncate max-w-[100px]">
                {username.length > 10 ? `${username.substring(0, 10)}...` : username}
              </span>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-48 p-2 shadow-lg"
            >
              <li>
                <Link href={`/user/${userId}`}>Account Settings</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
