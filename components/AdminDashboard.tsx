
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Building2, 
  MapPin, 
  Banknote, 
  Save, 
  X,
  Database
} from 'lucide-react';
import { Internship } from '../types';
import { getInternshipDB, saveInternship, deleteInternship } from '../services/dbService';

const AdminDashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Internship>>({});

  useEffect(() => {
    setInternships(getInternshipDB());
  }, []);

  const handleSave = () => {
    if (currentJob.title && currentJob.company) {
      saveInternship(currentJob as Internship);
      setInternships(getInternshipDB());
      setIsEditing(false);
      setCurrentJob({});
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this opportunity from the database?')) {
      deleteInternship(id);
      setInternships(getInternshipDB());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center">
            <Database className="mr-3 text-indigo-600" size={32} /> Opportunity Manager
          </h2>
          <p className="text-slate-500 mt-1">Manage official internship listings and partner companies.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrentJob({ type: 'Off-Campus', requiredSkills: [] }); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} className="mr-2" /> Add Opportunity
        </button>
      </header>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">{currentJob.id ? 'Edit' : 'New'} Opportunity</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Title</label>
                <input 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentJob.title || ''}
                  onChange={e => setCurrentJob({...currentJob, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Company</label>
                <input 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentJob.company || ''}
                  onChange={e => setCurrentJob({...currentJob, company: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Location</label>
                <input 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentJob.location || ''}
                  onChange={e => setCurrentJob({...currentJob, location: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Salary/Stipend</label>
                <input 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentJob.salary || ''}
                  onChange={e => setCurrentJob({...currentJob, salary: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Type</label>
                <select 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentJob.type}
                  onChange={e => setCurrentJob({...currentJob, type: e.target.value as any})}
                >
                  <option value="Off-Campus">Off-Campus</option>
                  <option value="Campus">Campus</option>
                  <option value="Local">Local</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                <textarea 
                  className="w-full mt-1.5 bg-slate-50 border-none rounded-2xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                  value={currentJob.description || ''}
                  onChange={e => setCurrentJob({...currentJob, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center justify-center"
              >
                <Save size={18} className="mr-2" /> Save Entry
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Position</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Company</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Salary</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {internships.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500 flex items-center mt-1"><MapPin size={12} className="mr-1" /> {job.location}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <Building2 size={16} />
                      </div>
                      <span className="font-bold text-slate-700">{job.company}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-emerald-600 font-black text-sm">
                      <Banknote size={16} className="mr-2" /> {job.salary}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md border border-slate-200 uppercase tracking-wider">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setCurrentJob(job); setIsEditing(true); }}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
