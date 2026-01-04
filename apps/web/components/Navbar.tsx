'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken, getUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const userData = getUser();
    setUserState(userData);
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
    router.refresh();
  };

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/jobs" className="shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                HireBridge
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-4">
              <NavLink href="/jobs" active={pathname === '/jobs'}>Browse Jobs</NavLink>
              {user?.role === 'CANDIDATE' && (
                <>
                  <NavLink href="/candidate/resumes" active={pathname === '/candidate/resumes'}>My Resumes</NavLink>
                  <NavLink href="/candidate/applications" active={pathname === '/candidate/applications'}>Applications</NavLink>
                </>
              )}
              {user?.role === 'RECRUITER' && (
                <NavLink href="/recruiter/jobs" active={pathname === '/recruiter/jobs'}>Manage Jobs</NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden md:block">Hi, <b>{user.fullName}</b></span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Login</Link>
                <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-indigo-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}
