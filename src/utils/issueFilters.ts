import type { JiraIssue } from '../types/jira';

export const sortByDueDate = (a: JiraIssue, b: JiraIssue) => {
  if (!a.duedate) return 1;
  if (!b.duedate) return -1;
  return new Date(a.duedate).getTime() - new Date(b.duedate).getTime();
};

export const filterTodoIssues = (issues: JiraIssue[]) =>
  issues.filter(i => i.statusCategory === 'Por hacer').sort(sortByDueDate);

export const filterInProgressIssues = (issues: JiraIssue[]) =>
  issues.filter(i =>
    i.statusCategory === 'En curso' &&
    i.status !== 'Esperando aprobación' &&
    i.status !== 'Detenido' &&
    i.status !== 'Detenida'
  ).sort(sortByDueDate);

export const filterAwaitingApprovalIssues = (issues: JiraIssue[]) =>
  issues.filter(i =>
    i.statusCategory === 'En curso' && i.status === 'Esperando aprobación'
  ).sort(sortByDueDate);

export const filterDetainedIssues = (issues: JiraIssue[]) =>
  issues.filter(i => i.status === 'Detenido' || i.status === 'Detenida')
    .sort(sortByDueDate);

export const calculateTotalHours = (issues: JiraIssue[]) =>
  issues.reduce((sum, issue) => sum + (Number(issue.storyPoints) || 0), 0); 