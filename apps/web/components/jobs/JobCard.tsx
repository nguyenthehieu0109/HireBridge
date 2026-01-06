'use client';

import Image from 'next/image';
import { MapPin, Briefcase, DollarSign, Bookmark, ExternalLink, Zap } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    level: string;
    type: string;
    salary?: string;
    tags: string[];
    matchScore: number;
    createdAt: string;
  };
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
}

export default function JobCard({ job, onSave, onApply }: JobCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-500/30 transition-all duration-300">
      
      {/* Match Score Badge */}
      <div className="absolute top-5 right-5">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm border ${
          job.matchScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
          job.matchScore >= 60 ? 'bg-brand-50 text-brand-700 border-brand-100' : 
          'bg-slate-50 text-slate-600 border-slate-100'
        }`}>
          <Zap size={12} fill="currentColor" />
          Match {job.matchScore}%
        </div>
      </div>

      <div className="flex gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300">
          {job.companyLogo ? (
            <Image src={job.companyLogo} alt={job.company} width={56} height={56} className="object-cover" />
          ) : (
            <span className="text-xl font-bold text-slate-400 capitalize">{job.company[0]}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-20">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
            {job.company}
            {/* Verified icon placeholder */}
            <span className="text-blue-500 text-[10px]">●</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[13px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-slate-400" />
              {job.level}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1.5 text-brand-600 font-bold">
                <DollarSign size={14} />
                {job.salary}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {job.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold tracking-tight uppercase border border-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
        <span className="text-xs font-medium text-slate-400">Đăng {job.createdAt}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSave?.(job.id)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all"
            title="Lưu công việc"
          >
            <Bookmark size={18} />
          </button>
          <button 
            onClick={() => onApply?.(job.id)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/5"
          >
            Ứng tuyển ngay
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
