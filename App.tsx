
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSearch, 
  Briefcase, 
  GraduationCap, 
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InternshipFinder from './components/InternshipFinder';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';
import { UserProfile, AnalysisResult, User, AuthState } from './types';

const INITIAL_PROFILE_KEY = 'intellicareer_user_profile';
const ANALYSIS_STORAGE_KEY = 'intellicareer_analysis_data';
const AUTH_STORAGE_KEY = 'intellicareer_auth';

const initialProfile: UserProfile = {
  name: "New Student",
  semester: 1,
  branch: "Computer Science",
  college: "Your University"
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(INITIAL_PROFILE_KEY);
    return saved ? JSON.parse(saved) : initialProfile;
  });
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() => {
    try {
      const saved = localStorage.getItem(ANALYSIS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem(INITIAL_PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (analysis) {
      localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    } else {
      localStorage.removeItem(ANALYSIS_STORAGE_KEY);
    }
  }, [analysis]);

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    setProfile(prev => ({ ...prev, name: user.name }));
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  if (!authState.isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden lg:flex">
          <div className="flex items-center space-x-2 mb-10 px-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">IntelliCareer</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLocationAwareLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLocationAwareLink to="/analyzer" icon={FileSearch} label="Resume Analyzer" />
            <SidebarLocationAwareLink to="/internships" icon={Briefcase} label="Internship Hub" />
            {authState.user?.role === 'Admin' && (
              <SidebarLocationAwareLink to="/admin" icon={ShieldCheck} label="Admin Panel" />
            )}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Authenticated as</p>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 truncate">{authState.user?.name}</p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{authState.user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 glass-effect border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900">{authState.user?.name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Session</p>
                </div>
                <img src={authState.user?.avatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm" alt="profile" />
              </div>
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard profile={profile} analysis={analysis} onClearAnalysis={() => setAnalysis(null)} />} />
              <Route path="/analyzer" element={<ResumeAnalyzer profile={profile} onAnalysisComplete={setAnalysis} onUpdateProfile={setProfile} />} />
              <Route path="/internships" element={<InternshipFinder analysis={analysis} />} />
              <Route 
                path="/admin" 
                element={authState.user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const SidebarLocationAwareLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
};

export default App;
