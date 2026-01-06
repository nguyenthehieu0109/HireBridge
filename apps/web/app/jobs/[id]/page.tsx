'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import Link from 'next/link';

interface Resume {
  id: string;
  fileName: string;
  isDefault: boolean;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  level: string;
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [note, setNote] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
        
        const currentUser = getUser();
        if (currentUser?.role === 'CANDIDATE') {
          const resumeRes = await api.get('/resumes');
          const resList: Resume[] = resumeRes.data;
          setResumes(resList);
          const defaultResume = resList.find(r => r.isDefault);
          if (defaultResume) setSelectedResume(defaultResume.id);
        }
      } catch (error) {
         console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const currentUser = getUser();
    if (currentUser) setUser(currentUser);
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    
    setApplying(true);
    try {
      await api.post('/applications', {
        jobId: id,
        resumeId: selectedResume || undefined,
        note
      });
      alert('Đã gửi hồ sơ ứng tuyển thành công!');
      router.push('/candidate/applications');
    } catch (error: unknown) {
      const err = error as Error & { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || err.message || 'Không thể ứng tuyển');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-size-[40px_40px] bg-[linear-gradient(to_right,rgba(2,132,199,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,132,199,0.06)_1px,transparent_1px)] pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/jobs" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors mb-6 group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Quay lại danh sách
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-linear-to-tr from-primary-600 to-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block">
                Hiring Now
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{job.title}</h1>
              <div className="mt-6 flex flex-wrap gap-4 items-center font-bold text-sm opacity-90">
                <span className="flex items-center gap-1.5">📍 {job.location}</span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                <span className="flex items-center gap-1.5">📈 {job.level}</span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                <span className="flex items-center gap-1.5">⏰ Full-time</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                  Mô tả công việc
                </h2>
                <div className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-[1.8]">
                  {job.description}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                  Yêu cầu kỹ năng
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind', 'NestJS'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border dark:border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {user?.role === 'CANDIDATE' ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-extrabold mb-4">Ứng tuyển ngay</h2>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Chọn CV</label>
                        <select
                          className="block w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                          value={selectedResume}
                          onChange={(e) => setSelectedResume(e.target.value)}
                        >
                          <option value="">-- CV Mặc định --</option>
                          {resumes.map(r => (
                            <option key={r.id} value={r.id}>{r.fileName}</option>
                          ))}
                        </select>
                        {resumes.length === 0 && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg">
                            <p className="text-amber-700 dark:text-amber-400 text-xs italic">
                              Bạn chưa có CV. Vui lòng <Link href="/candidate/resumes" className="font-bold underline">tạo CV</Link> trước khi ứng tuyển.
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Lời nhắn (Tùy chọn)</label>
                        <textarea
                          className="block w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm h-32 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                          placeholder="Tại sao bạn phù hợp với vị trí này?"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={applying}
                        className="w-full bg-primary-600 text-white font-black py-4 rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {applying ? 'Đang gửi...' : 'Gửi Đơn Ứng Tuyển'}
                      </button>
                    </form>
                  </div>
                ) : !user ? (
                   <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                     <div className="text-4xl mb-4">🔒</div>
                     <p className="text-slate-600 dark:text-slate-400 font-bold mb-6">Đăng nhập để ứng tuyển</p>
                     <Link href="/login" className="w-full bg-primary-600 text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-primary-500 transition-all">Đăng nhập ngay</Link>
                   </div>
                ) : (
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 italic text-slate-500 text-sm">
                    Giao diện ứng tuyển dành cho Ứng viên.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
