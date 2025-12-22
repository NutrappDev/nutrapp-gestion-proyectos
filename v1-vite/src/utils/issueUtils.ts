import { JiraIssue } from '@/types/jira';
import {
  filterTodoIssues,
  filterInProgressIssues,
  filterDetainedIssues,
  filterAwaitingApprovalIssues 
} from '@/utils/issueFilters';

export interface UserIssueCountsByCategory {
  total: number;
  backlog: number;
  inProgress: number; 
  awaitingApproval: number;
  detained: number;
}

export interface UserIssueSummary {
  name: string;
  avatar: string;
  initials: string;
  counts: UserIssueCountsByCategory;
}
type UserStats = {
  info: { name: string; avatar?: string };
  total: number;
  totalByStatus: Record<string, number>;
};

export type UserIssueCountsInput = JiraIssue[] | UserStats[];

export const getUserIssueCounts = (input: UserIssueCountsInput): UserIssueSummary[] => {
  // Si es un array de issues
  if (input.length > 0 && 'key' in input[0]) {
    const issues = input as JiraIssue[];
    const usersMap: { [key: string]: { assignee: { name: string; avatar: string; initials: string }; issues: JiraIssue[] } } = {};

    issues.forEach(issue => {
      const assignee = issue.assignee;
      if (assignee?.name) { 
        if (!usersMap[assignee.name]) {
          usersMap[assignee.name] = {
            assignee: {
              name: assignee.name,
              avatar: assignee.avatar || '',
              initials: assignee.initials || assignee.name.split(' ').map(w => w[0]).join('').toUpperCase()
            },
            issues: []
          };
        }
        usersMap[assignee.name].issues.push(issue);
      }
    });

    const userSummaries: UserIssueSummary[] = Object.values(usersMap).map(userEntry => {
      const userIssues = userEntry.issues;

      const backlogIssues = filterTodoIssues(userIssues);
      const inProgressIssues = filterInProgressIssues(userIssues);
      const awaitingApprovalIssues = filterAwaitingApprovalIssues(userIssues);
      const detainedIssues = filterDetainedIssues(userIssues);

      return {
        name: userEntry.assignee.name,
        avatar: userEntry.assignee.avatar,
        initials: userEntry.assignee.initials,
        counts: {
          total: userIssues.length,
          backlog: backlogIssues.length,
          inProgress: inProgressIssues.length,
          awaitingApproval: awaitingApprovalIssues.length,
          detained: detainedIssues.length,
        },
      };
    });

    return userSummaries.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Si es un array de stats del backend
  const stats = input as UserStats[];
  return stats.map(stat => ({
    name: stat.info.name,
    avatar: stat.info.avatar || '',
    initials: stat.info.name.split(' ').map(w => w[0]).join('').toUpperCase(),
    counts: {
      total: stat.total,
      backlog: stat.totalByStatus['Por hacer'] || 0,
      inProgress: stat.totalByStatus['En curso'] || 0,
      awaitingApproval: stat.totalByStatus['Esperando aprobación'] || 0,
      detained: stat.totalByStatus['Detenida'] || 0,
    },
  })).sort((a, b) => a.name.localeCompare(b.name));
};