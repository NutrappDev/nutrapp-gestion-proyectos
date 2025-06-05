export interface JiraAssignee {
  name: string;
  initials: string;
  avatar: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  statusCategory: string;
  assignee: JiraAssignee | null;
  priority: string;
  updated: string;
  storyPoints?: number;
  project: string;
}

export type StatusCategory = 'Por hacer' | 'En curso' | 'Listo';
