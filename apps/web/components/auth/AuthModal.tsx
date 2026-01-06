'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, RefreshCw, Building2, UserCircle } from 'lucide-react';
import { apiPost } from '@/lib/api';
import Logo from '../Logo';
import TurnstileWidget from './TurnstileWidget';

type Tab = 'login' | 'register' | 'forgot';
type AccountType = 'CANDIDATE' | 'RECRUITER';

export default function AuthModal({
  open,
  onClose,
  initialTab = 'login',
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Shared states
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  // Login states
  const [password, setPassword] = useState('');

  // Register states
  const [accountType, setAccountType] = useState<AccountType>('CANDIDATE');
  const [fullName, setFullName] = useState('');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [registerCode, setRegisterCode] = useState('');

  // Forgot Password states
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Reset modal state on open/close
  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setMessage(null);
    } else {
      // Reset everything after modal animation
      const timer = setTimeout(() => {
        setRegisterStep(1);
        setForgotStep(1);
        setAccountType('CANDIDATE');
        setEmail('');
        setPassword('');
        setFullName('');
        setRegisterCode('');
        setForgotCode('');
        setNewPassword('');
        setMessage(null);
        setTurnstileToken('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialTab]);

  if (!open) return null;

  const handleLogin = async () => {
    if (!email || !password) return setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin' });
    if (!turnstileToken) return setMessage({ type: 'error', text: 'Vui lòng hoàn thành xác minh CAPTCHA' });

    setLoading(true); setMessage(null);
    try {
      const data = await apiPost<{ access_token: string, user: { id: string, email: string, fullName: string, role: string } }>('/auth/login', {
        email,
        password,
        turnstileToken,
      });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage({ type: 'success', text: 'Đăng nhập thành công! Đang chuyển hướng...' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e: unknown) {
      const err = e as Error;
      setMessage({ type: 'error', text: err.message });
      setTurnstileToken(''); // Reset token on error
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSendOtp = async () => {
    if (!email || !password || !fullName) return setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin' });
    if (!turnstileToken) return setMessage({ type: 'error', text: 'Vui lòng hoàn thành xác minh CAPTCHA' });

    setLoading(true); setMessage(null);
    try {
      await apiPost('/auth/register', {
        email,
        password,
        fullName,
        role: accountType,
        turnstileToken,
      });
      setRegisterStep(2);
      setMessage({ type: 'success', text: 'Mã xác minh đã được gửi đến email của bạn.' });
    } catch (e: unknown) {
      const err = e as Error;
      setMessage({ type: 'error', text: err.message });
      setTurnstileToken(''); // Reset token on error
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!registerCode) return setMessage({ type: 'error', text: 'Vui lòng nhập mã xác minh' });

    setLoading(true); setMessage(null);
    try {
      await apiPost('/auth/verify-email', {
        email,
        code: registerCode,
      });
      setMessage({ type: 'success', text: 'Xác minh email thành công! Bạn có thể chọn tab Đăng nhập để truy cập.' });
      setTab('login');
      setRegisterStep(1);
    } catch (e: unknown) {
      const err = e as Error;
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOtp = async () => {
    if (!email) return setMessage({ type: 'error', text: 'Vui lòng nhập email công việc' });
    if (!turnstileToken) return setMessage({ type: 'error', text: 'Vui lòng hoàn thành xác minh CAPTCHA' });

    setLoading(true); setMessage(null);
    try {
      await apiPost('/auth/request-password-reset', {
        email,
        turnstileToken,
      });
      setForgotStep(2);
      setMessage({ type: 'success', text: 'Nếu email tồn tại, một mã xác minh đã được gửi.' });
    } catch (e: unknown) {
      const err = e as Error;
      setMessage({ type: 'error', text: err.message });
      setTurnstileToken(''); // Reset token on error
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotCode || !newPassword) return setMessage({ type: 'error', text: 'Vui lòng nhập mã xác minh và mật khẩu mới' });

    setLoading(true); setMessage(null);
    try {
      await apiPost('/auth/reset-password', {
        email,
        code: forgotCode,
        password: newPassword,
      });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
      setTab('login');
      setForgotStep(1);
    } catch (e: unknown) {
      const err = e as Error;
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-zoom-in border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 pt-8 pb-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center justify-between w-full px-4">
                <Logo iconSize={60} className="drop-shadow-2xl" />
                <span className="text-4xl font-black text-white tracking-tighter flex-1 text-center -ml-[60px]">Hire<span className="text-brand-600">Bridge</span></span>
             </div>
             <p className="text-slate-400 text-base font-black uppercase tracking-[0.4em] opacity-90">AI Recruitment Excellence</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => { setTab('login'); setMessage(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'login' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => { setTab('register'); setMessage(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'register' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Đăng ký
          </button>
          <button 
            onClick={() => { setTab('forgot'); setMessage(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'forgot' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Quên mật khẩu
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {message.text}
            </div>
          )}

          {/* Email Input (Shared for most steps) */}
          {((tab === 'login') || (tab === 'register' && registerStep === 1) || (tab === 'forgot' && forgotStep === 1)) && (
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email công việc</label>
               <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-medium"
                  />
               </div>
            </div>
          )}

          {/* LOGIN CONTENT */}
          {tab === 'login' && (
            <>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                  <button onClick={() => setTab('forgot')} className="text-xs font-bold text-brand-600 hover:underline">Quên?</button>
                </div>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-medium"
                    />
                </div>
              </div>

              {/* Turnstile CAPTCHA */}
              <TurnstileWidget onToken={setTurnstileToken} />

              <button 
                disabled={loading}
                onClick={handleLogin}
                className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "Đăng nhập ngay"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </>
          )}

          {/* REGISTER CONTENT - STEP 1 */}
          {tab === 'register' && registerStep === 1 && (
            <>
              {/* Account Type Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Loại tài khoản</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('CANDIDATE')}
                    className={`h-14 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      accountType === 'CANDIDATE'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <UserCircle size={20} />
                    Ứng viên
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('RECRUITER')}
                    className={`h-14 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      accountType === 'RECRUITER'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 size={20} />
                    Nhà tuyển dụng
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  {accountType === 'CANDIDATE' ? 'Họ và tên' : 'Tên công ty'}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    {accountType === 'CANDIDATE' ? <User size={18} /> : <Building2 size={18} />}
                  </div>
                  <input 
                    type="text"
                    placeholder={accountType === 'CANDIDATE' ? 'Nguyễn Văn A' : 'Công ty ABC'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-medium"
                  />
                </div>
              </div>

              {/* Turnstile CAPTCHA */}
              <TurnstileWidget onToken={setTurnstileToken} />

              <button 
                disabled={loading}
                onClick={handleRegisterSendOtp}
                className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "Gửi mã xác nhận qua Email"}
                {!loading && <Mail size={18} />}
              </button>
            </>
          )}

          {/* REGISTER CONTENT - STEP 2 */}
          {tab === 'register' && registerStep === 2 && (
            <div className="space-y-4 animate-fade-up">
               <div className="space-y-1.5 text-center mb-4">
                  <p className="text-sm text-slate-600">Chúng tôi đã gửi mã 6 số đến <b>{email}</b>. Vui lòng nhập mã để hoàn tất.</p>
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-center block">Mã xác minh (6 số)</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input 
                      type="text"
                      placeholder="000000"
                      value={registerCode}
                      onChange={(e) => setRegisterCode(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-bold tracking-[0.5em] text-center"
                      maxLength={6}
                    />
                  </div>
               </div>

               <button 
                disabled={loading}
                onClick={handleVerifyEmail}
                className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "Xác minh & Hoàn tất"}
              </button>
              
               <button 
                onClick={() => setRegisterStep(1)}
                className="w-full text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
                disabled={loading}
               >
                 Quay lại bước trước
               </button>
            </div>
          )}

          {/* FORGOT PASSWORD - STEP 1 */}
          {tab === 'forgot' && forgotStep === 1 && (
            <>
               {/* Turnstile CAPTCHA */}
               <TurnstileWidget onToken={setTurnstileToken} />

               <button 
                disabled={loading}
                onClick={handleForgotSendOtp}
                className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "Gửi mã đặt lại mật khẩu"}
              </button>
            </>
          )}

          {/* FORGOT PASSWORD - STEP 2 */}
          {tab === 'forgot' && forgotStep === 2 && (
            <div className="space-y-4 animate-fade-up">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mã xác minh</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input 
                      type="text"
                      placeholder="000000"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-bold tracking-[0.5em] text-center"
                      maxLength={6}
                    />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mật khẩu mới</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-[15px] font-medium"
                    />
                  </div>
               </div>

               <button 
                disabled={loading}
                onClick={handleResetPassword}
                className="w-full h-12 bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg active:scale-[0.98]"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : "Cập nhật mật khẩu"}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
           <p className="text-[11px] text-slate-500 font-medium">Bằng cách tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật của HireBridge.</p>
        </div>

      </div>
    </div>
  );
}
