import { JiraIssue } from '@/types/jira';
import { findTeamByAssignee, TEAMS } from '@/constants/team';
import { 
  filterTodoIssues, 
  filterInProgressIssues, 
  filterDetainedIssues, 
  filterAwaitingApprovalIssues 
} from '@/utils/issueFilters'; 

export interface TeamIssueCountsByCategory {
  total: number;
  backlog: number;
  inProgress: number; 
  awaitingApproval: number;
  detained: number;
}

export interface TeamSummary {
  id: string;
  name: string;
  initials: string;
  counts: TeamIssueCountsByCategory;
}

export const getTeamIssueCounts = (issues: JiraIssue[]): TeamSummary[] => {
  const teamCounts: Record<string, { issues: JiraIssue[], counts: TeamIssueCountsByCategory }> = {};

  TEAMS.forEach(team => {
    teamCounts[team.id] = {
      issues: [],
      counts: {
        total: 0,
        backlog: 0,
        inProgress: 0,
        detained: 0,
        awaitingApproval: 0,
      },
    };
  });

  issues.forEach(issue => {
    const assigneeName = issue.assignee?.name; 
    
    if (assigneeName) {
      const teamOfAssignee = findTeamByAssignee(assigneeName || '');

      if (teamOfAssignee) {
        teamCounts[teamOfAssignee.id].issues.push(issue);
      }
    }
  });

  return TEAMS.map(team => {
    const teamIssues = teamCounts[team.id].issues;

    const backlogIssues = filterTodoIssues(teamIssues);
    const inProgressIssues = filterInProgressIssues(teamIssues);
    const awaitingApprovalIssues = filterAwaitingApprovalIssues(teamIssues);
    const detainedIssues = filterDetainedIssues(teamIssues);

    return {
      id: team.id,
      name: team.name,
      initials: team.initials,
      counts: {
        total: teamIssues.length,
        backlog: backlogIssues.length,
        inProgress: inProgressIssues.length,
        awaitingApproval: awaitingApprovalIssues.length,
        detained: detainedIssues.length,
      },
    };
  }).sort((a, b) => a.name.localeCompare(b.name)); 
};