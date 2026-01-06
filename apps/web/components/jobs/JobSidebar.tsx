'use client';

import { Sparkles, Bookmark, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JobSidebar() {
  return (
    <aside className="space-y-6">
      
      {/* AI Assistant Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative group">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all duration-700" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-500" />
              AI Assistant
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-600 text-[10px] font-extrabold text-white uppercase tracking-wider">Beta</span>
          </div>
          
          <div className="space-y-3">
             <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 group-focus-within:border-brand-200 transition-all">
                <input 
                  placeholder="Gợi ý job phù hợp với tôi..."
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
             </div>
             
             <div className="grid grid-cols-1 gap-2">
                {[
                  "React Intern tại Hà Nội",
                  "Backend NestJS Junior",
                  "Việc làm Remote lương > $1000"
                ].map(prompt => (
                  <button 
                    key={prompt}
                    className="text-left py-2 px-3 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700 border border-transparent hover:border-brand-100 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Saved Jobs Quick View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Bookmark size={18} className="text-slate-700" />
            Việc làm đã lưu
          </h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase">0/10</span>
        </div>
        
        <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
           <p className="text-[13px] font-medium text-slate-500 px-6">Bạn chưa lưu công việc nào. Hãy bắt đầu khám phá!</p>
        </div>
        
        <Link 
          href="/saved" 
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Xem tất cả đã lưu
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Application Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-5">Checklist ứng tuyển</h3>
        
        <div className="space-y-4">
           <CheckItem label="Cập nhật thông tin cá nhân" status="DONE" />
           <CheckItem label="Tải lên CV (định dạng PDF)" status="TODO" />
           <CheckItem label="Thiết lập CV mặc định" status="TODO" />
           <CheckItem label="Xác minh email công việc" status="TODO" />
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-black/5 hover:bg-slate-800 transition-all">
          Cập nhật Hồ sơ ngay
        </button>
      </div>

    </aside>
  );
}

function CheckItem({ label, status }: { label: string; status: 'DONE' | 'TODO' }) {
  return (
    <div className="flex items-center justify-between group">
      <span className={`text-[13px] font-medium transition-colors ${status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
      {status === 'DONE' ? (
        <CheckCircle2 size={18} className="text-emerald-500" />
      ) : (
        <Circle size={18} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
      )}
    </div>
  );
}
