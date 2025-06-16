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

export const getUserIssueCounts = (issues: JiraIssue[]): UserIssueSummary[] => {
  const usersMap: { [key: string]: { assignee: { name: string; avatar: string; initials: string }; issues: JiraIssue[] } } = {};

  issues.forEach(issue => {
    const assignee = issue.assignee;
    if (assignee?.name) { 
      if (!usersMap[assignee.name]) {
        usersMap[assignee.name] = {
          assignee: {
            name: assignee.name,
            avatar: assignee.avatar || '',
            initials: assignee.initials || ''
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
};