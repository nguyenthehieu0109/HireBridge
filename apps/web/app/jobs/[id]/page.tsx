'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import Link from 'next/link';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [note, setNote] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);
      
      // If candidate, fetch resumes
      const currentUser = getUser();
      if (currentUser?.role === 'CANDIDATE') {
        const resumeRes = await api.get('/resumes');
        setResumes(resumeRes.data);
        const defaultResume = resumeRes.data.find((r: any) => r.isDefault);
        if (defaultResume) setSelectedResume(defaultResume.id);
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      alert('Application sent successfully!');
      router.push('/candidate/applications');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading job details...</div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/jobs" className="text-2xl font-bold text-indigo-600">HireBridge</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="mt-4 flex items-center space-x-4 opacity-90">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.level}</span>
            </div>
          </div>
          
          <div className="p-8">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </section>

            <hr className="my-8" />

            {user?.role === 'CANDIDATE' ? (
              <section className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Apply for this position</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Resume</label>
                    <select
                      className="block w-full border p-2 rounded bg-white"
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                    >
                      <option value="">-- Use Default Resume --</option>
                      {resumes.map(r => (
                        <option key={r.id} value={r.id}>{r.fileName}</option>
                      ))}
                    </select>
                    {resumes.length === 0 && (
                      <p className="text-amber-600 text-xs mt-1 italic">
                        No resumes found. Please <Link href="/candidate/resumes" className="underline">create one</Link> first.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      className="block w-full border p-2 rounded h-24"
                      placeholder="Why do you want this job?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {applying ? 'Submitting...' : 'Send Application'}
                  </button>
                </form>
              </section>
            ) : !user ? (
               <div className="text-center p-8 bg-indigo-50 rounded-lg border border-indigo-100">
                 <p className="text-indigo-800 font-medium mb-4">Sign in to apply for this job</p>
                 <Link href="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold inline-block">Login to Apply</Link>
               </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
