import axios from 'axios';
import type { JiraUsers, JiraIssue } from '../types/jira';

const API_BASE_URL = 'http://localhost:3001/api';

interface FetchIssuesParams {
  project?: string;
  assignee?: string | string[];
  page?: number;
  pageSize?: number;
}

export const fetchIssues = async (params: FetchIssuesParams): Promise<{
  issues: JiraIssue[];
  total: number;
  isLast: boolean;
}> => {
  const { project, assignee, page = 1, pageSize = 50 } = params;
  const queryParams = new URLSearchParams();

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

  const response = await axios.get(`${API_BASE_URL}/issues`, { params: queryParams });
  return response.data;
};

export const fetchUsers = async (): Promise<JiraUsers[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/issues/users`);
    console.log("response", response)
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};