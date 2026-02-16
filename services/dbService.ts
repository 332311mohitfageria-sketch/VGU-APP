
import { Internship } from "../types";

const DB_KEY = 'intellicareer_internship_db';

const defaultInternships: Partial<Internship>[] = [
  {
    id: 'db-1',
    title: 'Frontend Engineer Intern',
    company: 'TechFlow Systems',
    location: 'Remote',
    description: 'Work on cutting-edge React applications with a focus on UI/UX.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    type: 'Off-Campus',
    salary: '₹25,000/month',
    isReal: true
  },
  {
    id: 'db-2',
    title: 'Data Analyst Trainee',
    company: 'Global Analytics Co.',
    location: 'Bangalore, India',
    description: 'Learn to process large datasets and build predictive models.',
    requiredSkills: ['Python', 'SQL', 'Data Visualization'],
    type: 'Campus',
    salary: '₹30,000/month',
    isReal: true
  }
];

export const getInternshipDB = (): Internship[] => {
  const saved = localStorage.getItem(DB_KEY);
  if (!saved) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultInternships));
    return defaultInternships as Internship[];
  }
  return JSON.parse(saved);
};

export const saveInternship = (internship: Internship) => {
  const db = getInternshipDB();
  const index = db.findIndex(i => i.id === internship.id);
  if (index >= 0) {
    db[index] = internship;
  } else {
    db.push({ ...internship, id: Date.now().toString() });
  }
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const deleteInternship = (id: string) => {
  const db = getInternshipDB().filter(i => i.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};
