import axios from 'axios';
import type { JiraIssue } from '../types/jira';

const API_BASE_URL = 'http://localhost:3001/api';

interface FetchIssuesParams {
  project?: string;
  assignee?: string | string[];
  page?: number;
  pageSize?: number;
}

export const fetchIssues = async (params: FetchIssuesParams): Promise<JiraIssue[]> => {
  const { project, assignee } = params;
  const queryParams = new URLSearchParams();

  if (project) queryParams.append('project', project);

  const response = await axios.get(`${API_BASE_URL}/issues`, { params: queryParams });
  return response.data;
};
