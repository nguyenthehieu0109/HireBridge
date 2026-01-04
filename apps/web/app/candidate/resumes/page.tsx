'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newResume, setNewResume] = useState({ fileName: '', fileUrl: '', isDefault: false });
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/resumes', newResume);
      setNewResume({ fileName: '', fileUrl: '', isDefault: false });
      fetchResumes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add resume');
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Resumes</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Resume (File Link)</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Resume Name (e.g. Software Engineer CV)"
              className="border p-2 rounded"
              required
              value={newResume.fileName}
              onChange={(e) => setNewResume({ ...newResume, fileName: e.target.value })}
            />
            <input
              type="url"
              placeholder="File URL (Google Drive, Dropbox...)"
              className="border p-2 rounded"
              required
              value={newResume.fileUrl}
              onChange={(e) => setNewResume({ ...newResume, fileUrl: e.target.value })}
            />
            <div className="flex items-center space-x-2">
               <label className="flex items-center space-x-2 cursor-pointer">
                 <input
                   type="checkbox"
                   checked={newResume.isDefault}
                   onChange={(e) => setNewResume({ ...newResume, isDefault: e.target.checked })}
                 />
                 <span className="text-sm">Set as Default</span>
               </label>
               <button
                 type="submit"
                 disabled={creating}
                 className="bg-indigo-600 text-white px-4 py-2 rounded flex-1 hover:bg-indigo-700 disabled:bg-indigo-400"
               >
                 {creating ? 'Adding...' : 'Add Resume'}
               </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div>Loading resumes...</div>
        ) : (
          <div className="space-y-4">
            {resumes.length === 0 ? (
              <p className="text-gray-500 italic">No resumes added yet.</p>
            ) : (
              resumes.map((resume) => (
                <div key={resume.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold flex items-center">
                      {resume.fileName}
                      {resume.isDefault && (
                        <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded">Default</span>
                      )}
                    </h3>
                    <a href={resume.fileUrl} target="_blank" className="text-indigo-600 text-sm hover:underline">View File</a>
                  </div>
                  <div className="flex space-x-2">
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume.id)}
                        className="text-gray-600 text-sm hover:text-indigo-600 px-2 py-1 border rounded hover:border-indigo-600"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="text-red-500 text-sm hover:bg-red-50 px-2 py-1 rounded"
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
