
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ResumeFileData {
  data: string; // base64
  mimeType: string;
}

export const analyzeResume = async (
  resumeInput: string | ResumeFileData,
  branch: string,
  semester: number
): Promise<AnalysisResult> => {
  // Use gemini-3-pro-preview for complex tasks like document analysis
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    You are a meticulous Curriculum Auditor and Career Coach for undergraduate students.
    
    CRITICAL CONTEXT:
    The student is enrolled in the "${branch}" course and is currently in "Semester ${semester}".
    
    YOUR CORE TASK:
    1. Analyze the provided resume.
    2. COMPARE the student's skills against the RIGOROUS academic curriculum for ${branch} at the end of Semester ${semester}.
    3. IDENTIFY SPECIFIC MISSING SKILLS: Be pedantic. 
    4. RECOMMENDED INTERNSHIPS: 
       - Identify 3 representative internship roles fitting their current branch.
       - Include a realistic SALARY or STIPEND range for each.
       - CLASSIFY AS "Best Match" or "Good Match":
         - "Best Match": Excellent skill alignment (matchScore > 85) AND highly competitive salary for the region/role.
         - "Good Match": Solid skill alignment or good career stepping stone, even if salary is average.
       - Provide a SUITABILITY REASON explaining the synergy between their resume strengths and the company's offering (including the salary value).
       - Assign a salaryScore (0-100) based on how attractive the pay is for an intern.
    
    JSON OUTPUT STRUCTURE:
    - extractedSkills: Skills found in the resume with an estimated confidence level (0-100).
    - skillGaps: Skills expected for a ${branch} student in Sem ${semester} that are ABSENT or WEAK in the resume.
    - recommendations: Internship roles including salary, suitabilityReason, suitabilityLevel, and salaryScore.
    - learningPath: Specific resources to bridge the identified gaps.
    - summary: A 2-3 sentence assessment of their readiness.
  `;

  const parts = [];
  if (typeof resumeInput === 'string') {
    parts.push({ text: resumeInput });
  } else {
    parts.push({
      inlineData: {
        data: resumeInput.data,
        mimeType: resumeInput.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          extractedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER }
              },
              required: ["name", "level"]
            }
          },
          skillGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                currentLevel: { type: Type.NUMBER },
                targetLevel: { type: Type.NUMBER },
                importance: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["skill", "currentLevel", "targetLevel", "importance"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                description: { type: Type.STRING },
                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                type: { type: Type.STRING, enum: ["Campus", "Off-Campus", "Local"] },
                salary: { type: Type.STRING },
                suitabilityReason: { type: Type.STRING },
                suitabilityLevel: { type: Type.STRING, enum: ["Best Match", "Good Match"] },
                salaryScore: { type: Type.NUMBER }
              },
              required: ["id", "title", "company", "location", "matchScore", "description", "requiredSkills", "type", "salary", "suitabilityReason", "suitabilityLevel", "salaryScore"]
            }
          },
          learningPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                provider: { type: Type.STRING },
                url: { type: Type.STRING },
                skillAddressed: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["title", "provider", "url", "skillAddressed", "duration"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["extractedSkills", "skillGaps", "recommendations", "learningPath", "summary"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Analysis failed. Please try again.");
  }
};
