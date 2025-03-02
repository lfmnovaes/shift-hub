import { Suspense } from 'react';
import LoginForm from '@/components/login-form';

function LoginFormSkeleton() {
  return (
    <div className="form-control w-full gap-4 mt-4">
      <div>
        <div className="label">
          <span className="skeleton h-4 w-20"></span>
        </div>
        <div className="skeleton h-12 w-full"></div>
        <div className="h-6"></div>
      </div>
      <div>
        <div className="label">
          <span className="skeleton h-4 w-20"></span>
        </div>
        <div className="skeleton h-12 w-full"></div>
        <div className="h-6"></div>
      </div>
      <div className="skeleton h-12 w-full mt-4"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl text-center">Shift Hub Login</h1>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
