import React from 'react';
import type { JiraIssue } from '../types/jira';

interface IssueListProps {
  issues: JiraIssue[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  return (
    <div>
      <h2>Lista de Incidencias</h2>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            <strong>{issue.key}</strong> - {issue.summary} (Status: {issue.status})
            {issue.assignee && (
              <div>
                Asignado a: {issue.assignee.name} ({issue.assignee.initials})
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;
