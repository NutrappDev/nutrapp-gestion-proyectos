export interface JiraAssignee {
  name: string;
  initials: string;
  avatar: string;
}

export interface JiraUsers {
  name: string; 
  accountId: any; 
  avatarUrls: { [x: string]: any;}
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
  created: string;
  storyPoints?: number;
  project: string;
  duedate: string;
  url: string;
  reporter: JiraAssignee | null;
  lastComment?: JiraComment;
}

export type StatusCategory = 'Por hacer' | 'En curso' | 'Listo';

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    '48x48'?: string;
    '24x24'?: string;
    '16x16'?: string;
    '32x32'?: string;
  };
  projectTypeKey: string;
  simplified: boolean;
  lead: {
    accountId: string;
    displayName: string;
  } | null;
}

export interface ParsedJiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  statusCategory: string;
  assignee: JiraAssignee | null;
  priority: string;
  updated: Date;
  created: Date;
  storyPoints?: number;
  project: string;
  duedate: Date;
  url: string;
}

export interface JiraComment {
  type: 'doc';
  version: 1;
  content: JiraDocContent[];
  author?: JiraAssignee | null;
  created?: string;
}

export interface JiraDocAttrs {
  id?: string;
  text?: string;
  accessLevel?: string;
}

export interface JiraDocContent {
  type: string;
  content?: JiraDocContent[];
  text?: string;
  attrs?: JiraDocAttrs;
}