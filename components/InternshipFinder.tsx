
import React, { useState } from 'react';
import { AnalysisResult, Internship } from '../types';
import { 
  MapPin, 
  Building2, 
  ExternalLink, 
  Filter, 
  TrendingUp,
  Map,
  Banknote,
  Trophy,
  Info,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface InternshipFinderProps {
  analysis: AnalysisResult | null;
}

const InternshipFinder: React.FC<InternshipFinderProps> = ({ analysis }) => {
  const [filter, setFilter] = useState<'All' | 'Campus' | 'Off-Campus' | 'Local'>('All');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  const filtered = analysis?.recommendations.filter(r => 
    filter === 'All' ? true : r.type === filter
  ) || [];

  const handleApply = (job: Internship) => {
    setApplyingId(job.id);
    
    // Simulate API call to application portal
    setTimeout(() => {
      setApplyingId(null);
      setAppliedJobs(prev => new Set(prev).add(job.id));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Internship Matcher</h2>
          <p className="text-slate-500 mt-1">Discover opportunities ranked by curriculum match and salary competitiveness.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {['All', 'Campus', 'Off-Campus', 'Local'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === type 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((job, index) => {
            const isBestMatch = job.suitabilityLevel === 'Best Match';
            const hasApplied = appliedJobs.has(job.id);
            const isApplying = applyingId === job.id;
            
            return (
              <div 
                key={job.id} 
                className={`bg-white rounded-[2.5rem] border-2 transition-all group relative overflow-hidden flex flex-col animate-slide-up ${
                  isBestMatch 
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' 
                    : 'border-slate-100 shadow-sm hover:border-slate-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Ranking Badge */}
                <div className="absolute top-0 right-0">
                  <div className={`${
                    isBestMatch 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600'
                    } text-[10px] font-black px-5 py-2 uppercase tracking-[0.2em] rounded-bl-3xl flex items-center shadow-lg animate-slide-in-right duration-500`}
                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                  >
                    {isBestMatch ? <><Sparkles size={12} className="mr-2" /> {job.suitabilityLevel}</> : job.suitabilityLevel}
                  </div>
                </div>

                <div className="p-8 pb-4 flex-1">
                  <div className="flex items-center space-x-5 mb-8">
                    <div className={`w-16 h-16 ${isBestMatch ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'} rounded-[1.5rem] flex items-center justify-center group-hover:scale-105 transition-transform border border-transparent ${isBestMatch ? 'border-indigo-100' : ''}`}>
                      <Building2 size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{job.title}</h3>
                      <p className="text-slate-500 font-bold flex items-center mt-1">
                        {job.company} <span className="mx-2 text-slate-200">|</span> <MapPin size={14} className="mr-1 text-indigo-400" /> {job.location}
                      </p>
                    </div>
                  </div>

                  {/* Salary & Match Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl relative overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Stipend Value</p>
                        <p className="text-lg font-black text-emerald-900">{job.salary}</p>
                        <div className="mt-2 flex items-center">
                          <div className="flex-1 bg-emerald-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full transition-all duration-1000" style={{ width: `${job.salaryScore}%` }}></div>
                          </div>
                          <span className="ml-2 text-[10px] font-bold text-emerald-600">{job.salaryScore}% ROI</span>
                        </div>
                      </div>
                      <Banknote className="absolute -bottom-2 -right-2 text-emerald-100/50" size={56} />
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl relative overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.1 + 0.4}s` }}>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Skill Match</p>
                        <p className="text-lg font-black text-indigo-900">{job.matchScore}% Match</p>
                        <div className="mt-2 flex items-center">
                          <div className="flex-1 bg-indigo-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${job.matchScore}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <ShieldCheck className="absolute -bottom-2 -right-2 text-indigo-100/50" size={56} />
                    </div>
                  </div>

                  {/* Suitability Insight */}
                  <div className={`p-5 rounded-3xl border mb-8 transition-all duration-500 animate-slide-up ${isBestMatch ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 text-slate-700 border-slate-100'}`} style={{ animationDelay: `${index * 0.1 + 0.5}s` }}>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center ${isBestMatch ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <Info size={14} className="mr-2" /> Why this is the {job.suitabilityLevel.split(' ')[0]}?
                    </h4>
                    <p className={`text-sm leading-relaxed font-bold ${isBestMatch ? 'text-white' : 'text-slate-700'}`}>
                      "{job.suitabilityReason}"
                    </p>
                  </div>

                  <div className="mb-8 animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.6}s` }}>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.7}s` }}>
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="bg-white text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-wide hover:border-indigo-300 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer / Apply Action */}
                <div className="p-8 pt-0 mt-auto">
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Map size={14} className="text-slate-500" />
                      </div>
                      <span className="text-sm font-black text-slate-900">{job.type}</span>
                    </div>

                    <button 
                      onClick={() => handleApply(job)}
                      disabled={isApplying || hasApplied}
                      className={`relative overflow-hidden px-8 py-3.5 rounded-2xl font-black text-sm flex items-center transition-all shadow-xl active:scale-95 ${
                        hasApplied 
                          ? 'bg-emerald-500 text-white shadow-emerald-100' 
                          : isBestMatch 
                            ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200' 
                            : 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white shadow-sm'
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : hasApplied ? (
                        <>
                          <CheckCircle size={18} className="mr-2" />
                          Application Sent
                        </>
                      ) : (
                        <>
                          Apply Now <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Success Overlay Animation */}
                {hasApplied && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center animate-fade-in">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center border border-slate-100 animate-scale-in">
                       <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 scale-110">
                         <CheckCircle size={32} />
                       </div>
                       <h4 className="text-xl font-black text-slate-900">Applied Successfully!</h4>
                       <p className="text-sm text-slate-500 font-medium mt-1">Redirecting to {job.company} portal...</p>
                       <button 
                        onClick={() => setAppliedJobs(prev => {
                          const next = new Set(prev);
                          next.delete(job.id);
                          return next;
                        })}
                        className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors underline"
                       >
                         Withdraw Application
                       </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-fade-in">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
            <TrendingUp size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900">Personalize Your Job Board</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-4 leading-relaxed font-medium">
            Run an AI audit on your resume to unlock real-time internship matches that calculate salary value against your skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default InternshipFinder;
