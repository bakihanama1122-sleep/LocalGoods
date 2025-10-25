"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useSeller from '../hooks/useSeller';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't check authentication on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/success' || pathname === '/dummy-stripe-onboarding';
  
  const { seller, isLoading, isError } = useSeller({
    enabled: !isAuthPage
  });

  useEffect(() => {
    if (!isAuthPage && !isLoading && !seller && isError) {
      console.log('🔒 No authenticated seller, redirecting to login');
      router.push('/login');
    }
  }, [isAuthPage, isLoading, seller, isError, router]);

  // Show loading for protected pages while checking auth
  if (!isAuthPage && isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!isAuthPage && !seller && isError) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
