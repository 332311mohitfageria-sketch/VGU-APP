
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  Sparkles,
  File,
  X,
  ThumbsUp,
  User,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { UserProfile, AnalysisResult } from '../types';
import { analyzeResume, ResumeFileData } from '../services/geminiService';

interface ResumeAnalyzerProps {
  profile: UserProfile;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Business Administration"
];

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ profile, onAnalysisComplete, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    if (uploadedFile) setUploadedFile(null);
    if (error) setError(null);
  };

  const handleStartAnalysis = async () => {
    const input = uploadedFile 
      ? { data: uploadedFile.data, mimeType: uploadedFile.mimeType } 
      : resumeText.trim();

    if (!input || (typeof input === 'string' && !input)) {
      setError("Please provide your resume content or upload a file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      onUpdateProfile(localProfile);
      const result = await analyzeResume(input, localProfile.branch, localProfile.semester);
      onAnalysisComplete(result);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      if (file.type === 'application/pdf') {
        reader.onload = (event) => {
          const base64 = (event.target?.result as string).split(',')[1];
          setUploadedFile({
            name: file.name,
            data: base64,
            mimeType: file.type
          });
          setResumeText('');
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setResumeText(content);
          setUploadedFile(null);
        };
        reader.readAsText(file);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-scale-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ThumbsUp size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Analysis Complete!</h2>
        <p className="text-slate-500 mt-2">Personalizing your {localProfile.branch} dashboard...</p>
        <div className="mt-8 flex space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="text-center animate-slide-up">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 hover:scale-110 transition-transform">
          <Sparkles size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Resume & Skill Gap Analysis</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
          Ensure your resume matches your current semester curriculum and industry requirements for {localProfile.branch} students.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Profile Confirmation */}
        <div className="lg:col-span-1 space-y-6 animate-slide-in-right stagger-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <User className="text-indigo-600 mr-2" size={20} /> 1. Confirm Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Course/Branch</label>
                <select 
                  value={localProfile.branch}
                  onChange={(e) => handleProfileChange('branch', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Semester</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <button
                      key={sem}
                      onClick={() => handleProfileChange('semester', sem)}
                      className={`py-2 text-sm font-bold rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                        localProfile.semester === sem 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">College/Institution</label>
                <input 
                  type="text"
                  value={localProfile.college}
                  onChange={(e) => handleProfileChange('college', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Resume Content */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up stagger-2">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span className="flex items-center"><FileText className="text-indigo-600 mr-2" size={20} /> 2. Upload Content</span>
              <div className="flex space-x-2">
                <input 
                  type="file" 
                  id="resume-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf"
                />
                <label 
                  htmlFor="resume-upload"
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-100 transition-all flex items-center hover:scale-105"
                >
                  <Upload size={14} className="mr-1.5" />
                  PDF / TXT
                </label>
              </div>
            </h3>

            {uploadedFile ? (
              <div className="w-full h-80 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 transition-all animate-scale-in">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <File size={32} />
                </div>
                <p className="text-slate-900 font-bold text-center break-all max-w-[300px]">{uploadedFile.name}</p>
                <p className="text-slate-400 text-xs mt-1">Ready for curriculum comparison</p>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="mt-6 flex items-center text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} className="mr-1" /> Remove File
                </button>
              </div>
            ) : (
              <textarea
                className="w-full h-80 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
                placeholder="Paste your resume text here, or use the upload button..."
                value={resumeText}
                onChange={handleTextChange}
              ></textarea>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 animate-slide-up">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || (!resumeText.trim() && !uploadedFile)}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isAnalyzing || (!resumeText.trim() && !uploadedFile)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 scale-[1.01] hover:scale-[1.03] active:scale-95'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Cross-referencing {localProfile.branch} Syllabus...</span>
                  </>
                ) : (
                  <>
                    <span>Perform Curriculum Gap Analysis</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
