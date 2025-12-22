import axios, { AxiosInstance, AxiosError } from 'axios';
import type { JiraUsers, JiraIssue, JiraProject, JiraAssignee } from '@/src/types/jira';

const API_BASE_URL = process.env.NEXT_PUBLIC_JIRA_API_BASE_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('⚠️ NEXT_PUBLIC_JIRA_API_BASE_URL no está definida');
  console.error('Añade en .env.local: NEXT_PUBLIC_JIRA_API_BASE_URL=http://localhost:3001/api');
}

const jiraApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

jiraApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const contentType = error.response.headers?.['content-type'];
      const isHtmlResponse = contentType?.includes('text/html');
      if (isHtmlResponse) {
        throw new Error(`Server returned HTML (likely 404). Check API endpoint: ${API_BASE_URL}`);
      }
      throw new Error(
        `API Error: ${error.response.status} - ${
          (error.response.data as { message?: string })?.message ?? error.message
        }`
      );
    } else if (error.request) {
      throw new Error(`Network Error: No response from ${API_BASE_URL}. Is the server running?`);
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

// ------------------------
// Funciones de API
// ------------------------

export interface FetchIssuesParams {
  status?: string | string[];
  project?: string;
  assignee?: string | string[];
  page?: number;
  pageSize?: number;
}

export interface FetchIssuesResponse {
  data: Record<
    'Por hacer' | 'En curso' | 'Esperando aprobación' | 'Detenida',
    { issues: JiraIssue[]; total: number; nextPageToken?: string }
  >;
  total: number;
  isLast: boolean;
}

export const fetchIssues = async (params: FetchIssuesParams): Promise<FetchIssuesResponse> => {
  try {
    const response = await jiraApiClient.get<FetchIssuesResponse>('/issues', { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const fetchAssigneesWithStats = async (
  assignees: string | string[]
): Promise<Array<{ info: JiraAssignee; total: number; totalByStatus: Record<string, number> }>> => {
  const params: any = {};
  if (Array.isArray(assignees)) params.assignee = assignees;
  else params.assignee = [assignees];

  const response = await jiraApiClient.get('/users-with-stats', { params });
  return response.data.data;
};

export const fetchUsers = async (): Promise<JiraUsers[]> => {
  const response = await jiraApiClient.get<JiraUsers[]>('/users');
  return response.data;
};

export const fetchProjects = async (): Promise<JiraProject[]> => {
  const response = await jiraApiClient.get<JiraProject[]>('/projects');
  return response.data;
};
