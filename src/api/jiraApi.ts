import axios, { AxiosInstance, AxiosError } from 'axios';
import type { JiraUsers, JiraIssue, JiraProject } from '../types/jira';


const API_BASE_URL: string = 'https://nutrapp-gestion-proyectos-backend.onrender.com/api';

const jiraApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================================
//Interceptores de Respuesta (Manejo de Errores Global)
// ==========================================================
jiraApiClient.interceptors.response.use(
  (response) => response, 
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      throw new Error(`API Error: ${error.response.status} - ${((error.response.data as { message?: string })?.message) || error.message}`);
    } else if (error.request) {
      console.error('API No Response:', error.request);
      throw new Error('Network Error: No response received from server.');
    } else {
      console.error('API Request Error:', error.message);
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

// ==========================================================
// Tipos de Respuesta (mantener los tuyos existentes)
// ==========================================================
interface FetchIssuesParams {
  status?: string | string[];
  project?: string;
  assignee?: string | string[];
  page?: number;
  pageSize?: number;
}

export interface FetchIssuesResponse {
  issues: JiraIssue[];
  total: number;
  isLast: boolean;
}

// ==========================================================
// Funciones de la API
// ==========================================================

export const fetchIssues = async (params: FetchIssuesParams): Promise<FetchIssuesResponse> => {
  const { status, project, assignee, page = 1, pageSize = 50 } = params;
  const queryParams = new URLSearchParams();

  if (status) queryParams.append('status', Array.isArray(status) ? status.join(',') : status);
  if (project) queryParams.append('project', project);
  if (assignee) {
    if (Array.isArray(assignee)) {
      assignee.forEach(a => queryParams.append('assignee', a));
    } else {
      queryParams.append('assignee', assignee);
    }
  }
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());

  const response = await jiraApiClient.get<FetchIssuesResponse>('/issues', { params: queryParams });
  return response.data;
};

export const fetchUsers = async (): Promise<JiraUsers[]> => {
  const response = await jiraApiClient.get<JiraUsers[]>('/issues/users');
  return response.data;
};

export const fetchProjects = async (): Promise<JiraProject[]> => {
  const response = await jiraApiClient.get<JiraProject[]>('/issues/projects');
  return response.data;
};