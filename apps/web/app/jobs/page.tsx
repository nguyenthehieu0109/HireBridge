'use client';

import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import JobCard from '@/components/jobs/JobCard';
import JobSidebar from '@/components/jobs/JobSidebar';
import { Search, MapPin, Briefcase, Filter, X, LayoutGrid, ListFilter } from 'lucide-react';

interface Job {
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
}

function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const level = searchParams.get('level') || '';

  const [filters, setFilters] = useState({ q, location, level });

  // Mock data for initial UI demo
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer (React)',
      company: 'TechFlow AI',
      companyLogo: '',
      location: 'Hà Nội',
      level: 'Senior',
      type: 'Full-time',
      salary: '$2000 - $3500',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      matchScore: 92,
      createdAt: '2 giờ trước'
    },
    {
      id: '2',
      title: 'Backend Engineer (NestJS/Go)',
      company: 'DataCube Solutions',
      location: 'Hồ Chí Minh',
      level: 'Middle',
      type: 'Remote',
      salary: '$1500 - $2800',
      tags: ['NestJS', 'PostgreSQL', 'Docker', 'Go'],
      matchScore: 78,
      createdAt: '5 giờ trước'
    },
    {
       id: '3',
       title: 'AI/ML Engineer Intern',
       company: 'HireBridge AI',
       location: 'Đà Nẵng',
       level: 'Intern',
       type: 'Hybrid',
       salary: 'Thỏa thuận',
       tags: ['Python', 'PyTorch', 'FastAPI'],
       matchScore: 65,
       createdAt: '1 ngày trước'
    }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        // For now, let's use mock data if API fails or returns empty
        const { data } = await api.get(`/jobs?${params.toString()}`);
        setJobs(data.length > 0 ? data : mockJobs);
      } catch {
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.location) params.set('location', filters.location);
    if (filters.level) params.set('level', filters.level);
    router.push(`/jobs?${params.toString()}`);
  };

  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#AFEEEE]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
        
        {/* (A) HERO & STATS */}
        <div className="mb-10 text-center lg:text-left">
           <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
             Khám phá <span className="text-brand-600">Cơ hội</span>
           </h1>
           <p className="mt-3 text-slate-600 font-medium text-lg max-w-2xl">
             Kết nối với những đối tác hàng đầu cùng sự hỗ trợ của AI để tìm ra công việc phù hợp nhất.
           </p>
           
           <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2.5">
              {[
                { label: "120 jobs mới hôm nay", icon: "🔥", color: "text-orange-600 bg-orange-50 border-orange-100" },
                { label: "8 thành phố", icon: "📍", color: "text-blue-600 bg-blue-50 border-blue-100" },
                { label: "Match trung bình 78%", icon: "⚡", color: "text-brand-600 bg-brand-50 border-brand-100" },
                { label: "24 công ty verified", icon: "✅", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              ].map((stat) => (
                <div key={stat.label} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${stat.color} hover:scale-105 transition-transform cursor-default`}>
                  <span>{stat.icon}</span>
                  {stat.label}
                </div>
              ))}
           </div>
        </div>

        {/* (B) ADVANCED FILTER BAR */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 lg:p-8 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Kỹ năng / Vị trí</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="React, NestJS, Frontend..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  value={filters.q}
                  onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Địa điểm</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="TP. Hồ Chí Minh..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cấp bậc</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <select
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  <option value="">Tất cả cấp bậc</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead / Manager</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-2">
              <button type="submit" className="w-full h-12 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5">
                <Search size={18} />
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Active Filter Chips */}
          {(filters.q || filters.location || filters.level) && (
            <div className="mt-6 flex flex-wrap items-center gap-2 animate-fade-in">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mr-1">
                <Filter size={12} />
                Đang lọc:
              </span>
              {filters.q && (
                <button onClick={() => removeFilter('q')} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100 hover:bg-brand-100 transition-colors">
                  &quot;{filters.q}&quot; <X size={12} />
                </button>
              )}
              {filters.location && (
                <button onClick={() => removeFilter('location')} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                  {filters.location} <X size={12} />
                </button>
              )}
              {filters.level && (
                <button onClick={() => removeFilter('level')} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors">
                  {filters.level} <X size={12} />
                </button>
              )}
              <button 
                onClick={() => { setFilters({ q: '', location: '', level: '' }); router.push('/jobs'); }}
                className="ml-auto text-[11px] font-bold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* (C) MAIN CONTENT: 2-COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: JOB LIST */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Việc làm hiện có</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-extrabold">{jobs.length} tin</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg">
                     <button className="p-1.5 rounded-md bg-white shadow-sm text-slate-700"><LayoutGrid size={16} /></button>
                     <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700"><ListFilter size={16} /></button>
                  </div>
                  <select className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer">
                    <option>Sắp xếp: Mới nhất</option>
                    <option>Sắp xếp: Match cao</option>
                    <option>Sắp xếp: Lương cao</option>
                  </select>
               </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse shadow-soft" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy công việc phù hợp</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-8 font-medium">
                  Chúng tôi không tìm thấy kết quả nào khớp với các bộ lọc hiện tại. Hãy thử thay đổi từ khóa hoặc xóa bớt bộ lọc.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                   <button 
                    onClick={() => { setFilters({ q: '', location: '', level: '' }); router.push('/jobs'); }}
                    className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                   >
                     Xem tất cả việc làm
                   </button>
                   <button className="h-12 px-8 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95">
                     Tải CV để AI gợi ý
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
                
                {/* Pagination Placeholder */}
                <div className="pt-10 flex justify-center">
                   <button className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                     Xem thêm công việc
                   </button>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: SIDEBAR */}
          <section className="lg:col-span-4">
            <JobSidebar />
          </section>
          
        </div>
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
       </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
