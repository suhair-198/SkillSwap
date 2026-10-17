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

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Clear legacy mock tokens on initialization so stale tokens don't cause 403 Forbidden errors
if (typeof window !== 'undefined') {
  const existingToken = localStorage.getItem('token');
  if (existingToken && existingToken.startsWith('mock-')) {
    localStorage.removeItem('token');
    localStorage.removeItem('current_mock_user');
  }
}

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('current_mock_user');
    }
    let errorMsg = '';
    try {
      const data = await res.json();
      errorMsg = data.message || data.error || (typeof data === 'string' ? data : JSON.stringify(data));
    } catch {
      try {
        const text = await res.text();
        if (text) errorMsg = text;
      } catch {}
    }
    throw new Error(errorMsg || `Request failed with status ${res.status}`);
  }
  return res.json();
};

const handleVoidResponse = async (res: Response): Promise<void> => {
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('current_mock_user');
    }
    let errorMsg = '';
    try {
      const data = await res.json();
      errorMsg = data.message || data.error || (typeof data === 'string' ? data : JSON.stringify(data));
    } catch {
      try {
        const text = await res.text();
        if (text) errorMsg = text;
      } catch {}
    }
    throw new Error(errorMsg || `Request failed with status ${res.status}`);
  }
};

export const api = {
  auth: {
    login: async (data: any): Promise<{ token: string; user: UserDTO }> => {
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (err: any) {
        throw new Error(`Could not connect to backend server at ${API_BASE} (${err?.message || 'NetworkError'}). Please make sure the backend is running.`);
      }
      return handleResponse<{ token: string; user: UserDTO }>(res);
    },
    register: async (data: any): Promise<{ token: string; user: UserDTO }> => {
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (err: any) {
        throw new Error(`Could not connect to backend server at ${API_BASE} (${err?.message || 'NetworkError'}). Please make sure the backend is running.`);
      }
      return handleResponse<{ token: string; user: UserDTO }>(res);
    },
    me: async (): Promise<UserDTO> => {
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          headers: getHeaders(),
        });
      } catch (err: any) {
        throw new Error('Backend not reachable');
      }
      return handleResponse<UserDTO>(res);
    },
  },
  users: {
    getProfile: async (id: string): Promise<UserDTO> => {
      const res = await fetch(`${API_BASE}/users/profile/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse<UserDTO>(res);
    },
    updateProfile: async (data: any): Promise<UserDTO> => {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<UserDTO>(res);
    },
    getLeaderboard: async (): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/users/leaderboard`, {
        headers: getHeaders(),
      });
      return handleResponse<UserDTO[]>(res);
    },
    getAnalytics: async (userId?: string): Promise<any> => {
      const url = userId ? `${API_BASE}/users/analytics/${userId}` : `${API_BASE}/users/analytics`;
      const res = await fetch(url, {
        headers: getHeaders(),
      });
      return handleResponse<any>(res);
    },
  },
  skills: {
    getAll: async (): Promise<SkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills`, {
        headers: getHeaders(),
      });
      return handleResponse<SkillDTO[]>(res);
    },
    search: async (query: string): Promise<SkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/search?query=${encodeURIComponent(query)}`, {
        headers: getHeaders(),
      });
      return handleResponse<SkillDTO[]>(res);
    },
    getMy: async (): Promise<UserSkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/my`, {
        headers: getHeaders(),
      });
      return handleResponse<UserSkillDTO[]>(res);
    },
    getUserSkills: async (userId: string): Promise<UserSkillDTO[]> => {
      const res = await fetch(`${API_BASE}/skills/user/${userId}`, {
        headers: getHeaders(),
      });
      return handleResponse<UserSkillDTO[]>(res);
    },
    add: async (data: { skillName: string; category: string; proficiencyLevel: string; known: boolean }): Promise<UserSkillDTO> => {
      const res = await fetch(`${API_BASE}/skills/my`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<UserSkillDTO>(res);
    },
    remove: async (skillId: string, isKnown: boolean): Promise<void> => {
      const res = await fetch(`${API_BASE}/skills/my/${skillId}?isKnown=${isKnown}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
  },
  matches: {
    get: async (): Promise<MatchResponse[]> => {
      const res = await fetch(`${API_BASE}/matches`, {
        headers: getHeaders(),
      });
      return handleResponse<MatchResponse[]>(res);
    },
  },
  connections: {
    sendRequest: async (receiverId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/request/${receiverId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse<ConnectionDTO>(res);
    },
    acceptRequest: async (connectionId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/accept/${connectionId}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<ConnectionDTO>(res);
    },
    declineRequest: async (connectionId: string): Promise<ConnectionDTO> => {
      const res = await fetch(`${API_BASE}/connections/decline/${connectionId}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<ConnectionDTO>(res);
    },
    getMy: async (): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/connections`, {
        headers: getHeaders(),
      });
      return handleResponse<UserDTO[]>(res);
    },
    getPendingReceived: async (): Promise<ConnectionDTO[]> => {
      const res = await fetch(`${API_BASE}/connections/pending/received`, {
        headers: getHeaders(),
      });
      return handleResponse<ConnectionDTO[]>(res);
    },
    getPendingSent: async (): Promise<ConnectionDTO[]> => {
      const res = await fetch(`${API_BASE}/connections/pending/sent`, {
        headers: getHeaders(),
      });
      return handleResponse<ConnectionDTO[]>(res);
    },
  },
  pacts: {
    create: async (data: { userBId: string; skillAId: string; skillBId: string; goals: string }): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<SkillPactDTO>(res);
    },
    accept: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/accept/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<SkillPactDTO>(res);
    },
    decline: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/decline/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<SkillPactDTO>(res);
    },
    complete: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/complete/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<SkillPactDTO>(res);
    },
    logSession: async (id: string): Promise<SkillPactDTO> => {
      const res = await fetch(`${API_BASE}/pacts/sessions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse<SkillPactDTO>(res);
    },
    getMy: async (): Promise<SkillPactDTO[]> => {
      const res = await fetch(`${API_BASE}/pacts`, {
        headers: getHeaders(),
      });
      return handleResponse<SkillPactDTO[]>(res);
    },
  },
  chat: {
    getDirectHistory: async (userId: string): Promise<MessageDTO[]> => {
      const res = await fetch(`${API_BASE}/chat/direct/${userId}`, {
        headers: getHeaders(),
      });
      return handleResponse<MessageDTO[]>(res);
    },
    getGroupHistory: async (groupId: string): Promise<MessageDTO[]> => {
      const res = await fetch(`${API_BASE}/chat/group/${groupId}`, {
        headers: getHeaders(),
      });
      return handleResponse<MessageDTO[]>(res);
    },
    getUnreadCount: async (senderId: string): Promise<number> => {
      const res = await fetch(`${API_BASE}/chat/unread/${senderId}`, {
        headers: getHeaders(),
      });
      return handleResponse<number>(res);
    },
    markAsRead: async (senderId: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/chat/read/${senderId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
  },
  groups: {
    create: async (data: { name: string; description: string; isPrivate: boolean }): Promise<GroupDTO> => {
      const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<GroupDTO>(res);
    },
    getAllPublic: async (): Promise<GroupDTO[]> => {
      const res = await fetch(`${API_BASE}/groups`, {
        headers: getHeaders(),
      });
      return handleResponse<GroupDTO[]>(res);
    },
    getMy: async (): Promise<GroupDTO[]> => {
      const res = await fetch(`${API_BASE}/groups/my`, {
        headers: getHeaders(),
      });
      return handleResponse<GroupDTO[]>(res);
    },
    getDetails: async (id: string): Promise<GroupDTO> => {
      const res = await fetch(`${API_BASE}/groups/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse<GroupDTO>(res);
    },
    join: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/groups/${id}/join`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
    leave: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/groups/${id}/leave`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
    getMembers: async (id: string): Promise<UserDTO[]> => {
      const res = await fetch(`${API_BASE}/groups/${id}/members`, {
        headers: getHeaders(),
      });
      return handleResponse<UserDTO[]>(res);
    },
  },
  classes: {
    create: async (data: { title: string; description: string; groupId?: string; startTime: string; durationMinutes: number; meetingPlatform: string; meetingUrl: string }): Promise<LiveClassDTO> => {
      const res = await fetch(`${API_BASE}/classes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<LiveClassDTO>(res);
    },
    getUpcoming: async (): Promise<LiveClassDTO[]> => {
      const res = await fetch(`${API_BASE}/classes`, {
        headers: getHeaders(),
      });
      return handleResponse<LiveClassDTO[]>(res);
    },
    getDetails: async (id: string): Promise<LiveClassDTO> => {
      const res = await fetch(`${API_BASE}/classes/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse<LiveClassDTO>(res);
    },
    register: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/classes/${id}/register`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
    markAttendance: async (classId: string, userId: string, attended: boolean): Promise<void> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/attendance?userId=${userId}&attended=${attended}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleVoidResponse(res);
    },
    submitFeedback: async (classId: string, data: { rating: number; comments: string }): Promise<any> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<any>(res);
    },
    getFeedback: async (classId: string): Promise<any[]> => {
      const res = await fetch(`${API_BASE}/classes/${classId}/feedback`, {
        headers: getHeaders(),
      });
      return handleResponse<any[]>(res);
    },
    getGroupClasses: async (groupId: string): Promise<LiveClassDTO[]> => {
      const res = await fetch(`${API_BASE}/classes/group/${groupId}`, {
        headers: getHeaders(),
      });
      return handleResponse<LiveClassDTO[]>(res);
    },
  },
};
