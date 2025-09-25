import { Agent, Audit, CoachingTip, LeaderboardEntry, DailyMission, SkillArea, JourneyMilestone } from '../types';
import getCoachingFromAI, { getDailyMissionFromAI, getAIProTip } from './geminiService';

// --- GOOGLE SHEETS CONFIGURATION ---
const SPREADSHEET_ID = '1wQZ8TJad72KiS8dP4kS2XkOr82cTlHoLeTFlSt2rx28';

// Hardcoded API key to ensure functionality in simple local environments
// This key must have both Sheets and Vertex AI APIs enabled.
const API_KEY = "AIzaSyAXisyKMgnofnRfbf4023za1apjw2T6Vcs";

const AGENTS_SHEET = 'Agents';
const AUDITS_SHEET = 'Audits';
const COACHING_TIPS_SHEET = 'CoachingTips';

const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

// --- DATA FETCHING & PARSING ---

const toCamelCase = (s: string): string => {
    if (!s) return '';
    let str = s.replace(/\s+/g, '').replace(/^./, (match) => match.toLowerCase());
    if (str.endsWith('ID')) {
        str = str.slice(0, -2) + 'Id';
    }
    return str;
};

export const getSheetData = async <T>(sheetName: string): Promise<T[]> => {
  try {
    const response = await fetch(`${BASE_URL}/values/${sheetName}?key=${API_KEY}`);
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error?.message || JSON.stringify(errorData);
      console.error(`Failed to fetch sheet "${sheetName}". Status: ${response.status}. Message: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    const values = data.values;
    
    if (!values || values.length < 2) {
      console.warn(`Sheet "${sheetName}" is empty or has no data rows.`);
      return [];
    }

    const originalHeaders = values[0].map((h: string) => h ? h.trim() : '');
    const rows = values.slice(1);

    const processedRows = rows.map((row: any[]) => {
      const item: { [key: string]: any } = {};
      const feedbackParts: string[] = [];

      originalHeaders.forEach((header: string, index: number) => {
        const rawValue = row[index];
        if (rawValue === undefined || rawValue === null || rawValue === '') return;

        const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
        
        if (sheetName === AUDITS_SHEET && header.toLowerCase().includes('feedback')) {
            feedbackParts.push(String(value));
            return;
        }

        const camelHeader = toCamelCase(header);
        
        if (camelHeader === 'agentEmail' || camelHeader === 'auditorEmail') {
            item[camelHeader] = String(value).toLowerCase();
        } else if (camelHeader.toLowerCase().includes('score')) {
            item[camelHeader] = Number(value);
        } else if (camelHeader === 'timestamp') {
            const date = new Date(value);
            item[camelHeader] = !isNaN(date.getTime()) ? date.toISOString() : null;
        } else {
            item[camelHeader] = value;
        }
      });
      
      if (sheetName === AUDITS_SHEET && feedbackParts.length > 0) {
        item['feedback'] = feedbackParts.join('. ');
      }
      
      if (sheetName === AUDITS_SHEET && (item['timestamp'] === null || !item['agentEmail'])) {
          return null;
      }

      return item as T;
    });
    
    return processedRows.filter(item => item !== null) as T[];

  } catch (error) {
    console.error(`Error fetching or parsing sheet: ${sheetName}`, error);
    throw error;
  }
};

// --- IN-MEMORY CACHE for SESSION DATA ---
let audits: Audit[] = [];
let coachingTips: CoachingTip[] = [];
let isDataLoaded = false;
let agents: Agent[] = [];

const loadInitialData = async () => {
  if (isDataLoaded) return;

  const [loadedAgents, loadedAudits, loadedCoachingTips] = await Promise.all([
    getSheetData<Agent>(AGENTS_SHEET),
    getSheetData<Audit>(AUDITS_SHEET),
    getSheetData<CoachingTip>(COACHING_TIPS_SHEET),
  ]);

  agents = loadedAgents;
  audits = loadedAudits;
  coachingTips = loadedCoachingTips;

  const existingTipAuditIds = new Set(loadedCoachingTips.map(tip => tip.auditId));
  const tipsToGeneratePromises: Promise<void>[] = [];

  for (const audit of loadedAudits) {
    if (audit.overallScore < 80 && audit.feedback && audit.auditId && !existingTipAuditIds.has(audit.auditId)) {
      const promise = getCoachingFromAI(audit.feedback).then(async (tips) => {
        const newTip: CoachingTip = {
          coachingId: `coach_retro_${audit.auditId || Date.now()}`,
          auditId: audit.auditId,
          generatedCoachingTips: tips,
          timestamp: new Date().toISOString()
        };
        coachingTips.push(newTip);
      }).catch(error => {
          console.error(`Failed to generate tips for historical audit ${audit.auditId}:`, error);
          const errorTip: CoachingTip = {
              coachingId: `err_retro_${audit.auditId || Date.now()}`,
              auditId: audit.auditId,
              generatedCoachingTips: `ERROR: ${error.message}`,
              timestamp: new Date().toISOString()
          };
          coachingTips.push(errorTip);
      });
      tipsToGeneratePromises.push(promise);
    }
  }

  await Promise.all(tipsToGeneratePromises);
  isDataLoaded = true;
};

let initialDataPromise: Promise<void> | null = null;
const ensureDataLoaded = () => {
    if(!initialDataPromise) {
        initialDataPromise = loadInitialData();
    }
    return initialDataPromise;
}


// --- API FUNCTIONS ---

export const getAgentByEmail = async (email: string): Promise<Agent | undefined> => {
    // This function is special and is called before the main data load.
    const agentList = await getSheetData<Agent>(AGENTS_SHEET);
     if (agentList.length === 0 && email) {
        console.error("Login Check Failed: No agents were loaded from the 'Agents' sheet. Please check the following:\n1. The Google Sheet is shared as 'Anyone with the link can view'.\n2. The sheet tab is named exactly 'Agents' (case-sensitive).\n3. The sheet contains at least one agent row below the header.");
    }
    const foundAgent = agentList.find(a => a.agentEmail === email.toLowerCase().trim());
    if(!foundAgent) {
        console.error(`Login Check Failed: Email "${email}" was not found in the list of agents loaded from the sheet.`, { "Available emails": agentList.map(a => a.agentEmail) });
    }
    return foundAgent;
};

export const getAllAgents = async (): Promise<Agent[]> => {
    await ensureDataLoaded();
    return agents.filter(a => a.agentEmail !== 'auditor@rapido.com');
};

export const getDashboardData = async (agentEmail: string): Promise<{ audits: Audit[], coaching: CoachingTip[] }> => {
  await ensureDataLoaded();
  
  const normalizedAgentEmail = agentEmail.toLowerCase().trim();
  const agentAudits = audits
    .filter(audit => audit.agentEmail === normalizedAgentEmail)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const agentAuditIds = new Set(agentAudits.map(a => a.auditId));
  
  const agentCoaching = coachingTips
    .filter(tip => tip.auditId && agentAuditIds.has(tip.auditId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return { audits: agentAudits, coaching: agentCoaching };
};

export const getLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  await ensureDataLoaded();

  const agentMap = new Map(agents.map(a => [a.agentEmail, a.agentName]));
  const agentScores: { [key: string]: { totalScore: number, count: number, name: string } } = {};

  audits.forEach(audit => {
    const agentName = agentMap.get(audit.agentEmail) || 'Unknown Agent';
    if (!agentScores[audit.agentEmail]) {
      agentScores[audit.agentEmail] = { totalScore: 0, count: 0, name: agentName };
    }
    agentScores[audit.agentEmail].totalScore += audit.overallScore;
    agentScores[audit.agentEmail].count++;
  });
  
  const leaderboard = Object.values(agentScores).map(data => ({
    agentName: data.name,
    averageScore: parseFloat((data.totalScore / data.count).toFixed(2)),
    auditsCompleted: data.count,
    rank: 0,
  })).sort((a, b) => b.averageScore - a.averageScore || b.auditsCompleted - a.auditsCompleted);
  
  leaderboard.forEach((entry, index) => { entry.rank = index + 1; });
  return leaderboard;
};

export const submitNewAudit = async (auditData: Omit<Audit, 'auditId' | 'timestamp'>): Promise<Audit> => {
  await ensureDataLoaded();

  const newAudit: Audit = {
    ...auditData,
    agentEmail: auditData.agentEmail.toLowerCase().trim(),
    auditId: `aud_local_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  audits.unshift(newAudit);

  if (newAudit.overallScore < 80 && newAudit.feedback) {
    console.log("Score is below threshold, generating AI coaching...");
    try {
        const tips = await getCoachingFromAI(newAudit.feedback);
        const newCoachingTip: CoachingTip = {
            coachingId: `coach_local_${Date.now()}`,
            auditId: newAudit.auditId,
            generatedCoachingTips: tips,
            timestamp: new Date().toISOString()
        };
        coachingTips.unshift(newCoachingTip);
    } catch (error: any) {
        console.error("Failed to generate tips for new audit:", error);
        const errorTip: CoachingTip = {
            coachingId: `err_local_${Date.now()}`,
            auditId: newAudit.auditId,
            generatedCoachingTips: `ERROR: ${error.message}`,
            timestamp: new Date().toISOString()
        };
        coachingTips.unshift(errorTip);
    }
  }
  return newAudit;
};


export const getSkillUpData = async (agentEmail: string): Promise<{
    missionData: { mission: DailyMission; skills: SkillArea[] } | null;
    missionError: string | null;
    yesterdayScore: number | null;
    hasAuditsFromYesterday: boolean;
    rankData: { currentRank: number; agentAbove: LeaderboardEntry | null };
    journeyData: JourneyMilestone[];
}> => {
    await ensureDataLoaded();
    const normalizedEmail = agentEmail.toLowerCase().trim();
    const allAgentAudits = audits.filter(a => a.agentEmail === normalizedEmail);

    // 1. Get Yesterday's Audits for Daily Mission
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayAudits = allAgentAudits.filter(audit => {
        const auditDate = new Date(audit.timestamp);
        return auditDate >= yesterday && auditDate < today;
    });
    
    const hasAuditsFromYesterday = yesterdayAudits.length > 0;
    let yesterdayScore: number | null = null;
    if (yesterdayAudits.length > 0) {
        const total = yesterdayAudits.reduce((acc, a) => acc + a.overallScore, 0);
        yesterdayScore = parseFloat((total / yesterdayAudits.length).toFixed(2));
    }
    
    let missionData = null;
    let missionError: string | null = null;
    try {
        missionData = await getDailyMissionFromAI(yesterdayAudits);
    } catch (error: any) {
        console.error("Failed to get daily mission:", error);
        missionError = error.message;
    }


    // 2. Get Rank Data
    const leaderboard = await getLeaderboardData();
    const agentName = agents.find(a => a.agentEmail === normalizedEmail)?.agentName;
    const agentRankEntry = leaderboard.find(e => e.agentName === agentName);
    const currentRank = agentRankEntry ? agentRankEntry.rank : 0;
    let agentAbove: LeaderboardEntry | null = null;
    if(currentRank > 1) {
        agentAbove = leaderboard.find(e => e.rank === currentRank - 1) || null;
    }
    
    // 3. Define and Process Agent Journey for the CURRENT MONTH
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyAudits = allAgentAudits.filter(a => new Date(a.timestamp) >= startOfMonth);

    const totalAuditsThisMonth = monthlyAudits.length;
    
    let journeyMilestones: JourneyMilestone[] = [
        { name: "Quality Rookie", description: "Completed your first 5 quality audits.", quest: "Complete 5 audits", icon: "🚀", unlocksAt: 5, isUnlocked: totalAuditsThisMonth >= 5 },
        { name: "Consistency Champion", description: "Maintained an average score of 85%+ over 10 audits.", quest: "Maintain 85%+ average", icon: "🏆", unlocksAt: 10, isUnlocked: false },
        { name: "Feedback Virtuoso", description: "Received positive feedback on 15 audits.", quest: "15 positive feedback audits", icon: "✨", unlocksAt: 15, isUnlocked: false },
        { name: "Elite Performer", description: "Achieved a 95%+ score on 5 separate audits.", quest: "5 audits with 95%+ score", icon: "💎", unlocksAt: 25, isUnlocked: false },
    ];
    
    // Calculate progress for more complex milestones using this month's data
    if(totalAuditsThisMonth >= 10) {
        const recent10Audits = monthlyAudits.slice(0, 10);
        const avgScore = recent10Audits.reduce((acc, a) => acc + a.overallScore, 0) / recent10Audits.length;
        if(avgScore >= 85) journeyMilestones[1].isUnlocked = true;
    }
    const positiveFeedbackCount = monthlyAudits.filter(a => a.overallScore >= 80).length;
    if(positiveFeedbackCount >= 15) journeyMilestones[2].isUnlocked = true;

    const eliteScoreCount = monthlyAudits.filter(a => a.overallScore >= 95).length;
    if(eliteScoreCount >= 5) journeyMilestones[3].isUnlocked = true;

    // 4. Get AI Pro Tip for the latest unlocked milestone
    const lastUnlockedMilestone = [...journeyMilestones].reverse().find(m => m.isUnlocked);
    if(lastUnlockedMilestone) {
        try {
            const proTip = await getAIProTip(lastUnlockedMilestone.name);
            lastUnlockedMilestone.reward = { title: `Pro-Tip for a ${lastUnlockedMilestone.name}`, proTip };
        } catch (error: any) {
            console.error("Failed to get pro tip:", error);
            lastUnlockedMilestone.reward = { title: `Pro-Tip for a ${lastUnlockedMilestone.name}`, proTip: `Could not generate pro-tip. Details: ${error.message}` };
        }
    }

    return {
        missionData,
        missionError,
        yesterdayScore,
        hasAuditsFromYesterday,
        rankData: { currentRank, agentAbove },
        journeyData: journeyMilestones,
    };
};