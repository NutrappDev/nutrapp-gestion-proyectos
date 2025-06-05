import styled from '@emotion/styled';
import type { JiraIssue } from '../../types/jira';
import { useIssues } from '../../hooks/useIssues';

interface IssueCardProps {
  issue: JiraIssue;
  updateAssigneeFilter: (key: 'project' | 'assignee', value: string) => void;
  activeAssignee?: string;
}


const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: transform 0.2s;
  max-width: 300px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
`;

const AvatarCircle = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
  cursor: pointer; 
`;

const Content = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const KeyRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const IssueKey = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5e6c84;
`;

const HoursBadge = styled.span`
  font-size: 0.8rem;
  background-color: #f4f5f7;
  color: #5e6c84;
  padding: 2px 6px;
  border-radius: 4px;
`;

const Summary = styled.h3`
  font-size: 0.9rem;
  margin: 0;
  color: #172b4d;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
`;

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

export const IssueCard = ({ issue, updateAssigneeFilter }: IssueCardProps) => {
  const initials = issue.assignee?.initials || 'NA';
  const bgColor = stringToColor(initials);
  

  const handleAssigneeClick = () => {
    console.log(issue.assignee)
    if (issue.assignee?.name) {
      updateAssigneeFilter('assignee', issue.assignee.name);
    }
  };

  return (
    <Card aria-labelledby={`issue-${issue.key}-summary`}>
      <AvatarCircle 
        color={bgColor}
        onClick={handleAssigneeClick}
      >
        {initials}
      </AvatarCircle>
      
      <Content>
        <KeyRow>
          <IssueKey>{issue.key}</IssueKey>
          {issue.storyPoints! > 0 && (
            <HoursBadge>{issue.storyPoints}h</HoursBadge>
          )}
        </KeyRow>
        <Summary id={`issue-${issue.key}-summary`}>
          {issue.summary}
        </Summary>
      </Content>
    </Card>
  );
};