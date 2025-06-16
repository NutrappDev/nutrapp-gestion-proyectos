import * as d3 from 'd3';
import type { JiraIssue } from '../../types/jira';
import type { ParsedJiraIssue } from '../../types/jira';

export const getProjectColor = (project: string): string => {
  let hash = project.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  hash = Math.abs(hash);
  const hue = (hash-30) % 360; 
  const saturation = 70 ;
  const lightness = 60;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const parseJiraIssuesForGantt = (issues: JiraIssue[]): ParsedJiraIssue[] => {
  return issues.map(issue => {
    const createdDate = new Date(issue.created);
    const updatedDate = new Date(issue.updated);

    const createdUtcDay = d3.utcDay.floor(createdDate);
    const updatedUtcDay = d3.utcDay.floor(updatedDate);

    let duedateUtcDay: Date;
    if (issue.duedate) {
      duedateUtcDay = d3.utcDay.floor(new Date(issue.duedate));
    } else {
      duedateUtcDay = d3.utcDay.offset(updatedUtcDay, 1);
    }

    return {
      ...issue,
      created: createdUtcDay,
      updated: updatedUtcDay,
      duedate: duedateUtcDay,
      assignee: issue.assignee ? {
        ...issue.assignee,
        avatar: (issue.assignee as any).avatarUrl || issue.assignee.avatar 
      } : null
    };
  });
};