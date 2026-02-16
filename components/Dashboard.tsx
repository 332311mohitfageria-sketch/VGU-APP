
import React from 'react';
import { UserProfile, AnalysisResult } from '../types';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Target,
  BookOpen,
  FileSearch,
  Trash2,
  Zap,
  Star,
  GraduationCap,
  Sparkles,
  Banknote,
  Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SkillGapChart from './SkillGapChart';

interface DashboardProps {
  profile: UserProfile;
  analysis: AnalysisResult | null;
  onClearAnalysis: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, analysis, onClearAnalysis }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {profile.name}!</h2>
          <p className="text-slate-500 mt-1 flex items-center">
            Tracking progress for <b className="text-indigo-600 mx-1">{profile.branch}</b> Semester {profile.semester}
          </p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 flex items-center">
            <GraduationCap size={14} className="mr-1.5" /> {profile.branch}
          </span>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
            Semester {profile.semester}
          </span>
        </div>
      </header>

      {/* Quick Stats - Staggered Slide Up */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Target className="text-indigo-600" />} 
          label="Progress Score" 
          value={`${Math.round((profile.semester / 8) * 100)}%`} 
          color="bg-indigo-50"
          className="animate-slide-up stagger-1"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="Skills Audited" 
          value={analysis?.extractedSkills.length.toString() || "0"} 
          color="bg-emerald-50"
          className="animate-slide-up stagger-2"
        />
        <StatCard 
          icon={<TrendingUp className="text-blue-600" />} 
          label="Curriculum Match" 
          value={analysis && analysis.recommendations.length > 0 ? `${Math.max(...analysis.recommendations.map(r => r.matchScore))}%` : "0%"} 
          color="bg-blue-50"
          className="animate-slide-up stagger-3"
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="Critical Gaps" 
          value={analysis?.skillGaps.filter(g => g.importance === 'High').length.toString() || "0"} 
          color="bg-amber-50"
          className="animate-slide-up stagger-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Career Readiness Result - Slide Up */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Syllabus vs. Resume Gap Analysis</h3>
              <div className="flex items-center space-x-4">
                {analysis && (
                  <button 
                    onClick={onClearAnalysis}
                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all group"
                    title="Clear current analysis"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                {!analysis ? (
                  <Link to="/analyzer" className="text-indigo-600 font-semibold text-sm flex items-center hover:underline">
                    Start Analysis <ArrowRight size={16} className="ml-1" />
                  </Link>
                ) : (
                  <Link to="/analyzer" className="text-indigo-600 font-semibold text-sm flex items-center hover:underline">
                    Re-run Audit <ArrowRight size={16} className="ml-1" />
                  </Link>
                )}
              </div>
            </div>
            
            {analysis ? (
              <div className="space-y-8">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start space-x-4 relative overflow-hidden animate-scale-in">
                  <div className="absolute top-0 right-0 p-2 text-indigo-100 pointer-events-none">
                    <Sparkles size={64} />
                  </div>
                  <div className="bg-white p-2.5 rounded-xl text-indigo-600 shadow-sm shrink-0">
                    <Zap size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">AI Audit Summary</h4>
                    <p className="text-indigo-900 text-sm leading-relaxed font-medium">{analysis.summary}</p>
                  </div>
                </div>
                
                <div className="animate-fade-in stagger-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Visual Gap Breakdown</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Comparison: Resume vs Industry Std</span>
                  </div>
                  <div className="h-72 border border-slate-50 rounded-2xl p-4">
                     <SkillGapChart gaps={analysis.skillGaps} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="animate-slide-up stagger-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                      <CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Extracted Strengths
                    </h4>
                    <div className="space-y-3">
                      {analysis.extractedSkills.slice(0, 4).map((skill, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-700">{skill.name}</span>
                            <span className="text-xs font-bold text-indigo-600">{skill.level}% Proficiency</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="animate-slide-up stagger-5">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                      <Target size={16} className="mr-2 text-amber-500" /> Syllabus Gaps
                    </h4>
                    <div className="space-y-3">
                      {analysis.skillGaps.filter(g => g.importance === 'High').map((gap, idx) => (
                        <div key={idx} className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-center justify-between group hover:bg-amber-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                            <div>
                              <span className="text-sm font-bold text-amber-900 block leading-tight">{gap.skill}</span>
                              <span className="text-[10px] text-amber-600 font-medium">Expected in Sem {profile.semester}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-tighter">Critical</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                  <FileSearch size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Audit your Resume</h3>
                <p className="text-slate-500 max-w-sm mt-2 leading-relaxed">
                  We'll compare your current skills against the <b>{profile.branch}</b> Semester <b>{profile.semester}</b> curriculum to find missing prerequisites.
                </p>
                <Link to="/analyzer" className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95">
                  Start Skill Audit
                </Link>
              </div>
            )}
          </div>

          {/* Internship Matches Preview - Staggered Entry */}
          {analysis && analysis.recommendations.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-slide-up stagger-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Best Internship Matches</h3>
                <Link to="/internships" className="text-indigo-600 font-semibold text-sm flex items-center hover:underline">
                  View All Opportunities <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.recommendations.slice(0, 2).map((item, idx) => (
                  <div key={item.id} className={`p-5 border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all group bg-slate-50/30 animate-scale-in`} style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-100 text-slate-500 rounded-lg shadow-sm">{item.type}</span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        <Banknote size={14} className="mr-1" /> {item.salary}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{item.company}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-1">
                        <Trophy size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-600">{item.matchScore}% Match</span>
                      </div>
                      <Link to="/internships" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Apply →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 animate-slide-in-right stagger-3">
          {/* Learning Roadmap */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 text-slate-800 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
              <BookOpen size={160} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center tracking-tight">
                  <BookOpen className="mr-2 text-indigo-400" size={24} /> Skill Roadmap
                </h3>
                {analysis && <span className="text-[10px] font-bold bg-indigo-500/20 px-2 py-1 rounded text-indigo-300 uppercase tracking-widest border border-indigo-500/30">Curated</span>}
              </div>

              {analysis && analysis.learningPath.length > 0 ? (
                <div className="space-y-8">
                  {analysis.learningPath.slice(0, 3).map((course, idx) => (
                    <div key={idx} className="relative pl-7 border-l-2 border-slate-700 pb-2">
                      <div className="absolute left-[-7px] top-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900"></div>
                      <h4 className="text-sm font-bold leading-snug">{course.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{course.provider} • {course.duration}</p>
                      <a href={course.url} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 hover:text-white mt-3 inline-flex items-center font-bold uppercase transition-colors tracking-wide">
                        View Curriculum <ArrowRight size={12} className="ml-1" />
                      </a>
                    </div>
                  ))}
                  <button className="w-full bg-slate-800 hover:bg-slate-700 py-3.5 rounded-2xl text-sm font-bold transition-all border border-slate-700">
                    Full Learning Path
                  </button>
                </div>
              ) : (
                <div className="text-slate-400 text-sm italic py-4">
                  Analyze your resume to generate a personalized roadmap for your branch.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <Star className="text-amber-500 mr-2" size={20} /> Branch Tip
            </h3>
            <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "As a <b>{profile.branch}</b> student in <b>Semester {profile.semester}</b>, prioritizing internship roles with competitive stipends not only helps financially but often indicates a higher quality learning environment and mentorship program."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, className }: { icon: any, label: string, value: string, color: string, className?: string }) => (
  <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-slate-300 transition-all hover:scale-105 ${className}`}>
    <div className={`${color} p-3 rounded-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
