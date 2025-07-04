
import type { Agent, User, ApiSetting, WebhookEvent, ChatSession } from '../types';

const API_BASE = '/api'; // Replace with your actual API base URL if different

// By creating a custom type that omits `body` from `RequestInit` and then adds
// `body: any`, we can accept any object and then manually process it into
// a valid `BodyInit` type (e.g., a string) before passing to `fetch`.
interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

// --- Generic API Request Handler ---
async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const { body, ...rest } = options;
  const fetchOptions: RequestInit = rest;

  // Set default headers if not provided, but be smart about FormData.
  if (!fetchOptions.headers) {
    if (!(body instanceof FormData)) {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    } else {
      // For FormData, only set Accept. Let the browser handle Content-Type.
      fetchOptions.headers = { 'Accept': 'application/json' };
    }
  }
  
  // Stringify body if it's a plain object (i.e., not Blob, FormData etc.)
  if (body && typeof body === 'object' &&
      !(body instanceof Blob) &&
      !(body instanceof FormData)
     ) {
    fetchOptions.body = JSON.stringify(body);
  } else if (body) {
      // For FormData, Blob, strings, etc., assign directly.
      fetchOptions.body = body as BodyInit;
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
    throw new Error(errorData.message || 'An unknown API error occurred');
  }

  if (response.status === 204) { // No Content
    return null;
  }
  
  return response.json();
}

// --- Combined Initial Data Fetch ---
export const fetchInitialData = (): Promise<{ agents: Agent[], users: User[], apiSettings: ApiSetting[], logoUrl: string | null }> => {
    return apiRequest('/app-data');
};


// --- Agent Management ---
export const createAgent = (agentData: Omit<Agent, 'id'>): Promise<Agent> => {
  return apiRequest('/agents', { method: 'POST', body: agentData });
};
export const updateAgent = (id: string, agentData: Partial<Agent>): Promise<Agent> => {
  return apiRequest(`/agents/${id}`, { method: 'PUT', body: agentData });
};
export const deleteAgent = (id: string): Promise<void> => {
  return apiRequest(`/agents/${id}`, { method: 'DELETE' });
};

// --- User Management ---
export const createUser = (userData: Omit<User, 'id' | 'avatar'>): Promise<User> => {
    return apiRequest('/users', { method: 'POST', body: userData });
};
export const updateUser = (id: string, userData: Partial<User>): Promise<User> => {
    return apiRequest(`/users/${id}`, { method: 'PUT', body: userData });
};
export const deleteUser = (id: string): Promise<void> => {
    return apiRequest(`/users/${id}`, { method: 'DELETE' });
};

// --- API Settings Management ---
export const createApiSetting = (settingData: Omit<ApiSetting, 'id'>): Promise<ApiSetting> => {
    return apiRequest('/api-settings', { method: 'POST', body: settingData });
};
export const updateApiSetting = (id: string, settingData: ApiSetting): Promise<ApiSetting> => {
    return apiRequest(`/api-settings/${id}`, { method: 'PUT', body: settingData });
};
export const deleteApiSetting = (id: string): Promise<void> => {
    return apiRequest(`/api-settings/${id}`, { method: 'DELETE' });
};

// --- Chat Session Management ---
export const fetchSessions = (agentId: string): Promise<ChatSession[]> => {
    return apiRequest(`/sessions/${agentId}`);
};
export const updateSessionTitle = (id: string, title: string): Promise<ChatSession> => {
    return apiRequest(`/sessions/${id}`, { method: 'PUT', body: { title } });
};
export const deleteSession = (id: string): Promise<void> => {
    return apiRequest(`/sessions/${id}`, { method: 'DELETE' });
};

// --- Chat Interaction ---
interface SendMessagePayload {
  prompt: string;
  sessionId: string | null;
  agent: Agent;
}
interface SendMessageResponse {
    session: ChatSession;
}
export const sendMessage = (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    return apiRequest('/chat', { method: 'POST', body: payload });
};

// --- Branding ---
export const uploadLogo = (formData: FormData): Promise<{ url: string }> => {
    // Note: The generic apiRequest handles FormData Content-Type correctly.
    return apiRequest('/branding/logo', { method: 'POST', body: formData });
};


// --- Webhook Events ---
export const fetchWebhookEvents = (): Promise<WebhookEvent[]> => {
    return apiRequest('/webhook-events');
};
