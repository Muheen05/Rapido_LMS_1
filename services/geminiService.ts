import { GoogleGenAI, Type } from "@google/genai";
import { Audit } from '../types';

// Hardcoded API key to ensure functionality in simple local environments
const API_KEY = "AIzaSyAXisyKMgnofnRfbf4023za1apjw2T6Vcs";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getCoachingFromAI = async (feedbackText: string): Promise<string> => {
  try {
    const prompt = `You are an expert customer support coach for a mobility platform called Rapido. An agent has just received the following feedback on a customer interaction where they scored below the target:
---
${feedbackText}
---
Based *only* on this feedback, provide 3 specific, actionable, and constructive coaching tips in a bulleted list. The tone should be encouraging and supportive. Each tip should start with a '*' character.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Could not generate coaching tips due to an error.";
  }
};


export const getDailyMissionFromAI = async (audits: Audit[]): Promise<{ mission: any; skills: any; } | null> => {
  if (audits.length === 0) {
    return null;
  }

  const combinedFeedback = audits.map(a => `Score: ${a.overallScore}, Feedback: "${a.feedback}"`).join('\n');

  const prompt = `Analyze the following customer service audit feedback for a Rapido agent. Identify their 4 key skill areas (like Empathy, Problem Solving, Communication Fluency, Process Adherence) and rate each from 1 to 100 based on the feedback. Then, create a gamified "Daily Mission" to help them improve. The mission must have a motivational intro, a catchy mission title, and 2-3 specific challenges based on their weakest areas.
  
  Audit Data:
  ---
  ${combinedFeedback}
  ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    mission: {
                        type: Type.OBJECT,
                        properties: {
                            intro: { type: Type.STRING },
                            missionTitle: { type: Type.STRING },
                            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                    skills: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                skill: { type: Type.STRING },
                                score: { type: Type.NUMBER },
                            },
                        },
                    },
                },
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
      console.error("Error generating daily mission from AI:", error);
      return null;
  }
}

export const getAIProTip = async (milestoneTitle: string): Promise<string> => {
    const prompt = `You are an elite performance coach for customer support agents. An agent has just unlocked a significant milestone in their career called "${milestoneTitle}". Generate one advanced, "pro-level" tip related to this milestone that they can use to further elevate their skills. The tip should be insightful, concise, and motivational.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating AI pro tip:", error);
        return "Could not generate a pro tip at this time.";
    }
};


export default getCoachingFromAI;