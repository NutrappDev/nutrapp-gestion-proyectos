import styled from '@emotion/styled';
import type { JiraIssue } from '../../types/jira';

interface IssueCardProps {
  issue: JiraIssue;
  updateAssigneeFilter: (key: 'project' | 'assignee', value: string) => void;
  activeAssignee?: string;
}


const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: transform 0.2s;
  max-width: 320px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
`;

const AvatarImage = styled.img`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
  background-color: #f0f0f0; // Color de fondo por si la imagen no carga
`;

const AvatarFallback = styled.div<{ color: string }>`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
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
  font-size: 1rem;
  font-weight: 700;
  color: #171818;
  cursor: pointer;
`;

const HoursBadge = styled.span`
  font-size: 0.8rem;
  background-color: #f4f5f7;
  color: #5e6c84;
  padding: 2px 6px;
  border-radius: 4px;
`;

const Summary = styled.h3`
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
  color: #717886;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  -webkit-line-clamp: 2;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const DateBadge = styled.div`
  color: #5E6C84;
  font-size: 12px;
  font-weight: 500;
  background-color: #F4F5F7;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
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
  const formattedDate = issue.duedate 
  ? issue.duedate.slice(8, 10) + '/' + issue.duedate.slice(5, 7)
  : 'Sin fecha';
  

  const handleAssigneeClick = () => {
    if (issue.assignee?.name) {
      updateAssigneeFilter('assignee', issue.assignee.name);
    }
  };

  return (
    <Card aria-labelledby={`issue-${issue.key}-summary`}>
      {issue.assignee?.avatar ? (
        <AvatarImage 
          src={issue.assignee.avatar}
          alt={`Avatar de ${issue.assignee.name}`}
          onClick={handleAssigneeClick}
        />
      ) : (
        <AvatarFallback 
          color={bgColor}
          onClick={handleAssigneeClick}
        >
          {initials}
        </AvatarFallback>
      )}
      
      <Content>
        <KeyRow>
          <IssueKey onClick={() => window.open(issue.url, '_blank')}>{issue.key}</IssueKey>
          <FlexContainer>
            <DateBadge>{formattedDate}</DateBadge>
            {issue.storyPoints! > 0 && (
            <HoursBadge>{issue.storyPoints}h</HoursBadge>
          )}
          </FlexContainer>
        </KeyRow>
        <Summary id={`issue-${issue.key}-summary`} onClick={() => window.open(issue.url, '_blank')}>
          {issue.summary}
        </Summary>
      </Content>
    </Card>
  );
};