'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken, getUser } from '@/lib/auth';
import { useEffect, useState, memo, useCallback } from 'react';
import AuthModal from './auth/AuthModal';
import Logo from './Logo';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [lang, setLang] = useState('VI');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // Auth Check - only run on mount
    if (user === null) {
      const userData = getUser();
      if (userData) setUserState(userData);
    }

    // Initial Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    setThemeState(isDark ? 'dark' : 'light');

    // Scroll Listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = useCallback(() => {
    clearToken();
    setUserState(null);
    router.push('/');
    router.refresh();
  }, [router]);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'VI' ? 'EN' : 'VI');
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setThemeState(newTheme);
  }, [theme]);

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <header 
      id="main-header"
      className={`fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-slate-900 transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-black/20' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-32 flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-[10px] group focus:outline-none">
          <Logo iconSize={84} className="transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-[40px] text-white">
              Hire<span className="text-brand-600">Bridge</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-80">
              AI Recruitment
            </div>
          </div>
        </Link>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" active={pathname === '/'}>Trang chủ</NavLink>
          <NavLink href="/jobs" active={pathname === '/jobs'}>Việc làm</NavLink>
          <NavLink href="/how-it-works" active={pathname === '/how-it-works'}>Quy trình</NavLink>
          <Link 
            href="/jobs" 
            className="text-white translate-y-px font-semibold flex items-center gap-2 hover:bg-white/5 rounded-lg transition-all group"
          >
            <span>✨</span>
            AI Lab 
            <span className="text-[8px] bg-brand-600 text-white px-1.5 py-0.5 rounded font-bold uppercase ml-1 animate-pulse">New</span>
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Toggles */}
          <button 
            onClick={toggleLang}
            className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-800 text-sm font-bold text-white hover:bg-slate-700 transition shadow-sm"
          >
            {lang}
          </button>

          <button 
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white hidden lg:block font-medium">Chào, <b>{user.fullName}</b></span>
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-soft">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="h-9 px-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-white/5 transition"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="h-10 px-6 rounded-xl bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all"
                >
                  Đăng nhập / Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal 
        open={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default memo(Navbar);

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
  <Link 
    href={href} 
    className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
      active 
        ? 'text-white bg-white/10' 
        : 'text-white hover:bg-white/5'
    }`}
  >
    {children}
  </Link>
);
