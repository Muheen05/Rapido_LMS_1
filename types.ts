
export interface Agent {
  agentEmail: string;
  agentName: string;
  teamLead: string;
}

export interface Audit {
  auditId: string;
  timestamp: string;
  agentEmail: string;
  auditorEmail: string;
  ticketId: string;
  overallScore: number;
  feedback: string;
}

export interface CoachingTip {
  coachingId: string;
  auditId: string;
  generatedCoachingTips: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  agentName: string;
  averageScore: number;
  auditsCompleted: number;
}

export interface DailyMission {
    intro: string;
    missionTitle: string;
    challenges: string[];
}

export interface SkillArea {
    skill: string;
    score: number;
}

export interface MilestoneReward {
    title: string;
    proTip: string;
}

export interface JourneyMilestone {
    name: string;
    description: string;
    quest: string;
    icon: string; // Could be an emoji or an SVG path
    isUnlocked: boolean;
    unlocksAt: number; // e.g., number of audits, or average score
    reward?: MilestoneReward;
}