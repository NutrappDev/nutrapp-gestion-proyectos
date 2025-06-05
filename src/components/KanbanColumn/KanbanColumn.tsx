import styled from '@emotion/styled';
import { IssueCard } from '../IssueCard/IssueCard';
import type { JiraIssue } from '../../types/jira';

interface KanbanColumnProps {
  title: string;
  issues: JiraIssue[];
  onFilterChange: (key: 'project' | 'assignee', value: string) => void;
  titleColor: string;
  borderColor: string;
  bgColor: string;
  lightBgColor: string;
}

const ColumnContainer = styled.div<{ 
  bgColor: string; 
  borderColor: string;
  lightBgColor: string;
}>`
  flex: 1;
  text-align: start;
`;

const ColumnContent = styled.div<{borderColor: string; lightBgColor: string;}>`
  min-width: 300px;
  min-height: 300px;
  background: ${props => props.lightBgColor};
  border-radius: 8px;
  padding: 12px;
  padding-right: 3.5rem;
  padding-top: 1rem;
  margin: 0 8px;
  height: fit-content;
  border: 4px solid ${props => props.borderColor};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
`;

const ColumnHeaderWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 0 12px 12px;
`;

const ColumnHeader = styled.h2<{ titleColor: string, bgColor: string }>`
  font-size: 1rem;
  text-transform: uppercase;
  color: ${props => props.titleColor};
  margin: 0;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: ${props => props.bgColor};
  display: inline-block;
  padding-right: 32px; // Espacio para la burbuja
`;

const CountBadge = styled.span<{ bgColor: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${props => props.bgColor};
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

export const KanbanColumn = ({ 
  title, 
  issues, 
  onFilterChange, 
  titleColor,
  borderColor,
  bgColor,
  lightBgColor
}: KanbanColumnProps) => {
  return (
    <ColumnContainer 
      aria-label={`Columna ${title}`}
      bgColor={bgColor}
      borderColor={borderColor}
      lightBgColor={lightBgColor}
    >
      <ColumnHeaderWrapper>
        <ColumnHeader titleColor={titleColor} bgColor={bgColor}>
          {title}
        </ColumnHeader>
      </ColumnHeaderWrapper>
      <ColumnContent borderColor={borderColor} lightBgColor={lightBgColor}>
        <CountBadge bgColor={borderColor}>
            {issues.length}
          </CountBadge>
        <IssuesList>
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} updateAssigneeFilter={onFilterChange}/>
          ))}
        </IssuesList>
      </ColumnContent>
    </ColumnContainer>
  );
};