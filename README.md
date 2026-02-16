
# IntelliCareer: College Internship Matcher

IntelliCareer is an advanced AI-powered career orientation platform designed specifically for undergraduate students. It bridges the gap between academic curriculum and professional requirements.

## 🚀 Key Features

- **AI Resume Audit**: Detailed analysis of skills vs. current semester branch curriculum using Gemini Pro.
- **Curriculum Gap Analysis**: Visualizes exactly what subjects you're missing for your specific course and semester.
- **Smart Internship Matcher**: Classification of opportunities as "Best Match" or "Good Match" based on both skills and salary value.
- **Persistent Database**: A centralized "Real" internship database managed by admins.
- **Admin Panel**: Role-based access for managing official listings.
- **Learning Roadmaps**: Automatically generated learning paths to bridge identified skill gaps.

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **AI Engine**: Google Gemini 3 Pro (Generative AI)
- **State Management**: React Hooks + LocalStorage Persistence
- **Visualization**: Recharts (for skill gap radar/bar charts)
- **Routing**: React Router DOM

## 🔐 Auth Roles

- **Student**: Access to analyzer, matches, and dashboard.
- **Admin**: Full access + Opportunity Database Management.

## 📦 Deployment

Optimized for **Vercel** and **Railway**. Includes `vercel.json` for SPA route handling.
