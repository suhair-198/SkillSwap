import { 
  UserDTO, 
  SkillDTO, 
  UserSkillDTO, 
  MatchResponse, 
  ConnectionDTO, 
  MessageDTO, 
  GroupDTO, 
  LiveClassDTO, 
  SkillPactDTO 
} from './types';

const API_BASE = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    login: async (data: any): Promise<{ token: string; user: UserDTO }> => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text() || 'Login failed');
      return res.json();
    },
    register: async (data: any): Promise<{ token: string; user: UserDTO }> => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text() || 'Registration failed');
      return res.json();
    },
    me: async (): Promise<UserDTO> => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to get current user');
      return res.json();
    },
  },
  users: {
    getProfile: async (id: string): Promise<UserDTO> => {
      const res = await fetch(`${API_BASE}/users/profile/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Profile not found');
      return res.json();
    },
    updateProfile: async (data: any): Promise<UserDTO> => {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    getLeaderboard: async (): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/users/leaderboard`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return res.json();
    },
    getAnalytics: async (userId?: string): Promise<any> => {
      const url = userId ? `${API_BASE}/users/analytics/${userId}` : `${API_BASE}/users/analytics`;
      const res = await fetch(url, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  },
  skills: {
    getAll: async (): Promise<SkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch skills');
      return res.json();
    },
    search: async (query: string): Promise<SkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/search?query=${encodeURIComponent(query)}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    getMy: async (): Promise<UserSkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/my`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch user skills');
      return res.json();
    },
    getUserSkills: async (userId: string): Promise<UserSkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/user/${userId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch user skills');
      return res.json();
    },
    add: async (data: { skillName: string; category: string; proficiencyLevel: string; known: boolean }): Promise<UserSkillDTO> => {
      const res = await fetch(`${API_BASE}/skills/my`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add skill');
      return res.json();
    },
    remove: async (skillId: string, isKnown: boolean): Promise<void> => {
      const res = await fetch(`${API_BASE}/skills/my/${skillId}?isKnown=${isKnown}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to remove skill');
    },
  },
  matches: {
    get: async (): Promise<MatchResponse[]> => {
      const res = await fetch(`${API_BASE}/matches`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },
  },
  connections: {
    sendRequest: async (receiverId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/request/${receiverId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to send connection request');
      return res.json();
    },
    acceptRequest: async (connectionId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/accept/${connectionId}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to accept request');
      return res.json();
    },
    declineRequest: async (connectionId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/decline/${connectionId}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to decline request');
      return res.json();
    },
    getMy: async (): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/connections`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch connections');
      return res.json();
    },
    getPendingReceived: async (): Promise<ConnectionDTO[]> => {
      const res = await fetch(`${API_BASE}/connections/pending/received`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch received requests');
      return res.json();
    },
    getPendingSent: async (): Promise<ConnectionDTO[]> => {
      const res = await fetch(`${API_BASE}/connections/pending/sent`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch sent requests');
      return res.json();
    },
  },
  pacts: {
    create: async (data: { userBId: string; skillAId: string; skillBId: string; goals: string }): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create skill pact');
      return res.json();
    },
    accept: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/accept/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to accept pact');
      return res.json();
    },
    decline: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/decline/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to decline pact');
      return res.json();
    },
    complete: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/complete/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to complete pact');
      return res.json();
    },
    logSession: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/sessions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to log session');
      return res.json();
    },
    getMy: async (): Promise<SkillPactDTO[]> => {
      const res = await fetch(`${API_BASE}/pacts`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch pacts');
      return res.json();
    },
  },
  chat: {
    getDirectHistory: async (userId: string): Promise<MessageDTO[]> => {
      const res = await fetch(`${API_BASE}/chat/direct/${userId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch direct chat history');
      return res.json();
    },
    getGroupHistory: async (groupId: string): Promise<MessageDTO[]> => {
      const res = await fetch(`${API_BASE}/chat/group/${groupId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch group chat history');
      return res.json();
    },
    getUnreadCount: async (senderId: string): Promise<number> => {
      const res = await fetch(`${API_BASE}/chat/unread/${senderId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to get unread count');
      return res.json();
    },
    markAsRead: async (senderId: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/chat/read/${senderId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark messages as read');
    },
  },
  groups: {
    create: async (data: { name: string; description: string; isPrivate: boolean }): Promise<GroupDTO> => {
      const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create group');
      return res.json();
    },
    getAllPublic: async (): Promise<GroupDTO[]> => {
      const res = await fetch(`${API_BASE}/groups`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch groups');
      return res.json();
    },
    getMy: async (): Promise<GroupDTO[]> => {
      const res = await fetch(`${API_BASE}/groups/my`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch my groups');
      return res.json();
    },
    getDetails: async (id: string): Promise<GroupDTO> => {
      const res = await fetch(`${API_BASE}/groups/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch group details');
      return res.json();
    },
    join: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/groups/${id}/join`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to join group');
    },
    leave: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/groups/${id}/leave`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to leave group');
    },
    getMembers: async (id: string): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/groups/${id}/members`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch group members');
      return res.json();
    },
  },
  classes: {
    create: async (data: { title: string; description: string; groupId?: string; startTime: string; durationMinutes: number; meetingPlatform: string; meetingUrl: string }): Promise<LiveClassDTO> => {
      const res = await fetch(`${API_BASE}/classes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to schedule class');
      return res.json();
    },
    getUpcoming: async (): Promise<LiveClassDTO[]> => {
      const res = await fetch(`${API_BASE}/classes`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch classes');
      return res.json();
    },
    getDetails: async (id: string): Promise<LiveClassDTO> => {
      const res = await fetch(`${API_BASE}/classes/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch class details');
      return res.json();
    },
    register: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/classes/${id}/register`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to register for class');
    },
    markAttendance: async (classId: string, userId: string, attended: boolean): Promise<void> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/attendance?userId=${userId}&attended=${attended}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark attendance');
    },
    submitFeedback: async (classId: string, data: { rating: number; comments: string }): Promise<any> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      return res.json();
    },
    getFeedback: async (classId: string): Promise<any[]> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/feedback`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch feedback');
      return res.json();
    },
    getGroupClasses: async (groupId: string): Promise<LiveClassDTO[]> => {
      const res = await fetch(`${API_BASE}/classes/group/${groupId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch group classes');
      return res.json();
    },
  },
};
