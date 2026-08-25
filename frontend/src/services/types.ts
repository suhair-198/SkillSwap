export interface Role {
  id?: number;
  name: string;
}

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePictureUrl?: string;
  college?: string;
  department?: string;
  xp: number;
  level: number;
  reputation: number;
  currentStreak: number;
  roles?: Role[];
}

export interface SkillDTO {
  id?: string;
  name: string;
  category: string;
}

export interface UserSkillDTO {
  id: string;
  userId: string;
  skill: SkillDTO;
  proficiencyLevel: string; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  isKnown: boolean; // true = teaches, false = learns
}

export interface MatchResponse {
  peer: UserDTO;
  matchingScore: number;
  skillsTeachedByPeer: SkillDTO[];
  skillsWantedByPeer: SkillDTO[];
  sharedSkills: SkillDTO[];
}

export interface ConnectionDTO {
  id: string;
  requester: UserDTO;
  receiver: UserDTO;
  status: string; // PENDING, ACCEPTED, DECLINED
  createdAt: string;
}

export interface MessageDTO {
  id: string;
  sender: UserDTO;
  recipient?: UserDTO;
  groupId?: string;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface GroupDTO {
  id: string;
  name: string;
  description?: string;
  creator: UserDTO;
  isPrivate: boolean;
  createdAt: string;
}

export interface LiveClassDTO {
  id: string;
  title: string;
  description?: string;
  instructor: UserDTO;
  group?: GroupDTO;
  startTime: string;
  durationMinutes: number;
  meetingPlatform: string; // GOOGLE_MEET, ZOOM, TEAMS, JITSI
  meetingUrl: string;
  createdAt: string;
}

export interface SkillPactDTO {
  id: string;
  userA: UserDTO;
  userB: UserDTO;
  skillA: SkillDTO;
  skillB: SkillDTO;
  status: string; // REQUESTED, ACCEPTED, ACTIVE, COMPLETED, CANCELLED
  goals?: string;
  sessionsCount: number;
  createdAt: string;
}
