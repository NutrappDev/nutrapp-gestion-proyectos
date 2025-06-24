import { JiraAssignee, JiraIssue } from '@/types/jira';
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

type UserStats = {
  info: JiraAssignee;
  total: number;
  totalByStatus: Record<string, number>;
};

export type TeamIssueCountsInput = JiraIssue[] | UserStats[];


export const getTeamIssueCounts = (input: TeamIssueCountsInput): TeamSummary[] => {
  // Si es un array de issues
  if (input.length > 0 && 'key' in input[0]) {
    const issues = input as JiraIssue[];
    const teamCounts: Record<string, { issues: JiraIssue[] }> = {};

    TEAMS.forEach(team => {
      teamCounts[team.id] = {
        issues: [],
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
  }

  // Si es un array de stats del backend
  const stats = input as UserStats[];
  return TEAMS.map(team => {

    const teamMembersStats = stats.filter(stat => findTeamByAssignee(stat.info.name)?.id == team.id);
    const totalByStatus = teamMembersStats.reduce(
      (acc, stat) => {
        Object.entries(stat.totalByStatus).forEach(([status, count]) => {
          acc[status] = (acc[status] || 0) + count;
        });
        return acc;
      },
      {} as Record<string, number>
    );
    const total = teamMembersStats.reduce((sum, stat) => sum + stat.total, 0);

    return {
      id: team.id,
      name: team.name,
      initials: team.initials,
      counts: {
        total,
        backlog: totalByStatus['Por hacer'] || 0,
        inProgress: totalByStatus['En curso'] || 0,
        awaitingApproval: totalByStatus['Esperando aprobación'] || 0,
        detained: totalByStatus['Detenida'] || 0,
      },
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};