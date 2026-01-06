'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

  return (
    <div className="antialiased font-sans bg-[#AFEEEE] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 selection:bg-brand-500 selection:text-white pt-32">
      {/* 1. Hero Section */}
      <section id="home" className="relative pt-28 md:pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-soft opacity-[0.22]" />
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-brand-400/25 rounded-full blur-[120px]" />
          <div className="absolute top-24 -right-40 w-[520px] h-[520px] bg-indigo-400/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col items-start text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              AI RECRUITMENT PLATFORM 2026
            </div>

            <h1 className="text-[38px] leading-[1.05] md:text-[48px] lg:text-[56px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              <span className="block lg:whitespace-nowrap">
                Tuyển dụng &amp; Tìm việc
              </span>
              <span className="block mt-3 text-brand-600">
                Thông minh với AI
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
              Nâng tầm trải nghiệm tìm việc và tuyển dụng. Phân tích hồ sơ chuyên sâu, gợi ý việc làm chính xác và kết nối tức thì.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/register?role=candidate"
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-card hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Tôi là Ứng viên
              </Link>
              <Link 
                href="/register?role=recruiter"
                className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-sm flex items-center justify-center gap-2"
              >
                Tôi là Nhà tuyển dụng
              </Link>
            </div>
            
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-brand-600 flex items-center gap-2 transition-colors">
              Xem Thêm <span className="translate-y-px">↓</span>
            </a>
          </div>

          {/* Right: Premium Mockup */}
          <div className="relative perspective-2000 group">
            <div className="absolute -inset-10 bg-brand-500/10 rounded-full blur-[100px] opacity-20" />
            
            <div className="relative w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-800 shadow-card overflow-hidden z-10 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-2 bg-slate-50 shadow-inner dark:bg-slate-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-auto w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              
              <div className="p-8 space-y-6">
                <div className="p-5 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">AI Resume Scanner</div>
                    <div className="text-sm font-black text-brand-600 uppercase">92% Match</div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="w-[92%] h-full bg-brand-500 shadow-lg shadow-brand-500/30" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">Senior Web Developer</div>
                      <div className="text-xs text-slate-500">Google Inc • US</div>
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      98% FIT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card: AI Chat */}
            <div className="absolute right-4 -bottom-8 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card p-5 z-20 animate-floaty">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-black text-brand-700">AI</div>
                <div>
                  <div className="text-xs font-black dark:text-white">AI Assistant</div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</div>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
                  CV phù hợp <b>95%</b> với vị trí này.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl animate-fade-up">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Quy trình đơn giản, <br />
                <span className="text-brand-600">Kết quả vượt trội</span>
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Bắt đầu hành trình chinh phục sự nghiệp hoặc tìm kiếm nhân tài ngay hôm nay.</p>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl relative shadow-inner animate-fade-up">
              <div 
                className={`absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 shadow-sm rounded-xl transition-all duration-300 ease-out z-0 ${
                  role === 'employer' ? 'translate-x-full' : 'translate-x-0'
                }`}
              />
              <button 
                onClick={() => setRole('candidate')}
                className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  role === 'candidate' ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                }`}
              >
                Ứng viên
              </button>
              <button 
                onClick={() => setRole('employer')}
                className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  role === 'employer' ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                }`}
              >
                Nhà tuyển dụng
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {role === 'candidate' ? (
              <>
                <Step number="1" title="Tạo hồ sơ thông minh" desc="Tự động phân tích CV, trích xuất kỹ năng nổi bật bằng AI." emoji="📄" color="bg-brand-500" />
                <Step number="2" title="AI Matching" desc="Gợi ý việc làm phù hợp nhất với điểm số match score 90%." emoji="🎯" color="bg-indigo-500" />
                <Step number="3" title="Chat & Phỏng vấn" desc="Kết nối trực tiếp nháy mắt, phỏng vấn ngay trên nền tảng." emoji="💬" color="bg-violet-500" />
              </>
            ) : (
              <>
                <Step number="1" title="Đăng tin tự động" desc="AI hỗ trợ viết JD chuẩn, thu hút đúng nhân tài tiềm năng." emoji="📝" color="bg-brand-600" />
                <Step number="2" title="Quản lý Pipeline" desc="Lọc ứng viên thông minh theo Kanban, chốt deal cực nhanh." emoji="📊" color="bg-indigo-600" />
                <Step number="3" title="Tuyển dụng 0s" desc="Kết nối tức thì với ứng viên phù hợp nhất mà không cần chờ." emoji="⚡" color="bg-violet-600" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-24 bg-[#AFEEEE] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tính năng nổi bật</h2>
            <div className="h-1.5 w-24 bg-brand-600 rounded-full mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard title="Đăng Job Siêu Tốc" desc="Tạo tin tuyển dụng chỉ trong 2 phút với AI template chuẩn chỉ." icon="⚡" />
            <FeatureCard title="One-Click Apply" desc="Ứng tuyển nhanh chóng vào hàng loạt job chỉ bằng một cú chạm." icon="👆" />
            <FeatureCard title="Pipeline Kanban" desc="Theo dõi quá trình phỏng vấn trực quan theo từng bước cụ thể." icon="📋" />
            <FeatureCard title="Realtime Chat" desc="Hệ thống chat nội bộ mượt mà, loại bỏ sự rườm rà của email." icon="💬" />
            <FeatureCard title="AI Feedback" desc="Nhận đánh giá và cải thiện CV ngay lập tức từ trợ lý AI." icon="🤖" />
            <FeatureCard title="Smart Matching" desc="Thuật toán độc quyền giúp tìm ra ứng viên khớp 99% yêu cầu." icon="🎯" />
          </div>
        </div>
      </section>

    </div>
  );
}

function Step({ number, title, desc, emoji, color }: { number: string; title: string; desc: string; emoji: string; color: string }) {
  return (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 group hover:-translate-y-2 transition-all duration-300 shadow-soft animate-fade-up">
      <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl mb-8 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>{emoji}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bước {number}</div>
      <h4 className="font-extrabold text-2xl mb-4 text-slate-900 dark:text-white">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card hover:border-brand-500/30 transition-all duration-300 animate-fade-up">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl mb-6 shadow-inner ring-1 ring-slate-100 dark:ring-slate-700">{icon}</div>
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

