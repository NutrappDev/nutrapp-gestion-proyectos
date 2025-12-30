'use client';

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { JiraUsers, JiraIssue, JiraProject } from '@/types/jira';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('⚠️ NEXT_PUBLIC_API_URL no está definida');
  console.error('Añade en .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000/api');
}

// Instancia Axios
const jiraApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

jiraApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }
  return config;
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
        `API Error: ${error.response.status} - ${(error.response.data as { message?: string })?.message ?? error.message
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

export const fetchMe = async () => {
  const { data } = await jiraApiClient.get('/jira/me');
  return data;
};

export const fetchUsers = async (query: string = "''"): Promise<JiraUsers[]> => {
  const { data } = await jiraApiClient.get('/jira/users', {
    params: { query },
  });

  return data;
};


export const fetchProjects = async () => {
  const { data } = await jiraApiClient.get('/jira/projects');
  return data;
};

export const fetchIssuesByProject = async (projectKey: string): Promise<JiraIssue[]> => {
  const jql = `project=\"${projectKey}\"`
  const { data } = await jiraApiClient.post('/jira/issues/by-project', { jql, fields: ["*all"] });
  return data;
};

export const fetchIssuesByUser = async (accountId: string): Promise<JiraIssue[]> => {
  const jql = `assignee='${accountId.trim()}'`;
  const { data } = await jiraApiClient.post('/jira/issues/by-user', { jql, fields: ["*all"] });
  return data;
};

export const fetchAllIssues = async (jql): Promise<JiraIssue[]> => {
  const { data } = await jiraApiClient.post('/jira/issues/all', { jql });
  return data;
};

export const fetchIssueTotals = async (type: 'assignee' | 'status' | 'project') => {
  const { data } = await jiraApiClient.get('/jira/issues/totals', { params: { type } });
  return data;
};

export const fetchStoryPoints = async (type: 'assignee' | 'project') => {
  const { data } = await jiraApiClient.get('/jira/issues/story-points', { params: { type } });
  return data;
};

export const fetchIssueProgress = async (issueKey: string, cutoff?: string) => {
  const { data } = await jiraApiClient.get('/jira/progress/issue', { params: { issueKey, cutoff } });
  return data;
};

export const fetchEpicProgress = async (epicKey: string, cutoff?: string) => {
  const { data } = await jiraApiClient.get('/jira/progress/epic', { params: { epicKey, cutoff } });
  return data;
};

export const fetchProjectProgress = async (projectKey: string) => {
  const totalJql = `project = '${projectKey}'`;
  const doneJql = `project = '${projectKey}' AND statusCategory = Done`;

  const [totalRes, doneRes] = await Promise.all([
    jiraApiClient.post('/jira/progress/project', {
      jql: totalJql
    }),
    jiraApiClient.post('/jira/progress/project', {
      jql: doneJql
    }),
  ]);

  const total = totalRes.data.total;
  const done = doneRes.data.total;

  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    total,
    done,
    progress,
  };
};


export const addComment = async (issueKey: string, comment: string) => {
  const { data } = await jiraApiClient.post('/jira/issues/comment', { issueKey, comment });
  return data;
};

export const updateComment = async (issueKey: string, commentId: string, comment: string) => {
  const { data } = await jiraApiClient.put('/jira/issues/comment', { issueKey, commentId, comment });
  return data;
};

export const deleteComment = async (issueKey: string, commentId: string) => {
  const { data } = await jiraApiClient.delete('/jira/issues/comment', { params: { issueKey, commentId } });
  return data;
};
