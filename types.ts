
export type Role = 'Student' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UserProfile {
  name: string;
  semester: number;
  branch: string;
  college: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  importance: 'High' | 'Medium' | 'Low';
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  type: 'Campus' | 'Off-Campus' | 'Local';
  salary: string; 
  suitabilityReason: string;
  suitabilityLevel: 'Best Match' | 'Good Match';
  salaryScore: number;
  isReal?: boolean; // Flag for database-originated entries
}

export interface LearningResource {
  title: string;
  provider: string;
  url: string;
  skillAddressed: string;
  duration: string;
}

export interface AnalysisResult {
  extractedSkills: Skill[];
  skillGaps: SkillGap[];
  recommendations: Internship[];
  learningPath: LearningResource[];
  summary: string;
}
