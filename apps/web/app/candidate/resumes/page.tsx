'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  isDefault: boolean;
  size: number;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resumes');
      setResumes(data);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isDefault', String(isDefault));

      await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      setIsDefault(false);
      fetchResumes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setCreating(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/resumes/${id}/default`);
      fetchResumes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
    } catch (error) {
      console.error(error);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Resumes</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Upload New Resume</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
              <div className="flex items-center space-x-4">
                 <label className="flex items-center space-x-2 cursor-pointer">
                   <input
                     type="checkbox"
                     checked={isDefault}
                     onChange={(e) => setIsDefault(e.target.checked)}
                     className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                   />
                   <span className="text-sm text-gray-600">Set as Default</span>
                 </label>
                 <button
                   type="submit"
                   disabled={creating}
                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                 >
                   {creating ? 'Uploading...' : 'Upload CV'}
                 </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your resumes...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {resumes.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500">No resumes uploaded yet. Get started by uploading your first CV!</p>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 font-bold">
                        CV
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
                          {resume.fileName}
                          {resume.isDefault && (
                            <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{formatSize(resume.size)}</span>
                          <span>•</span>
                          <a 
                            href={`http://localhost:4000${resume.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume.id)}
                        className="text-xs font-semibold text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
