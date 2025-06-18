import { ArrowOutward, AccessTime, Message } from '@mui/icons-material';
import type { JiraIssue } from '@/types/jira';
import { IconButton, Box, Collapse } from '@mui/material';
import { PriorityIcon } from './PriorityIcon';
import { useState } from 'react';
import { JiraCommentRenderer } from '../UI/JiraCommentRenderer'
import {
  Card,
  AvatarImage,
  AvatarFallback,
  Content,
  Summary,
  SummaryContent,
  HoursBadge,
  KeyContent,
  FlexContainer,
  DateBadge,
  ActionButtons,
  CommentContainer,
  CommentHeader,
  CommentContent
} from './IssueCard.styles';
import { useFiltersContext } from '@/context/FiltersContext';

interface IssueCardProps {
  issue: JiraIssue;
  activeAssignee?: string;
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

export const IssueCard = ({ issue }: IssueCardProps) => {
  const { updateFilter: updateAssigneeFilter } = useFiltersContext();
  const [showComment, setShowComment] = useState(false);
  const initials = issue.assignee?.initials || 'NA';
  const bgColor = stringToColor(initials);

  const formattedCommentDate = issue.lastComment && issue.lastComment.created 
    ? new Date(issue.lastComment.created).toLocaleDateString() 
    : 'Fecha desconocida';
    
  const formattedDate = issue.duedate 
  ? issue.duedate.slice(8, 10) + '/' + issue.duedate.slice(5, 7)
  : 'Sin fecha';

  const handleAssigneeClick = () => {
    if (issue.assignee?.name) {
      updateAssigneeFilter('assignee', issue.assignee.name);
    }
  };

  const handleIssueClick = () => window.open(issue.url, '_blank');
  const toggleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComment(!showComment);
  };

  return (
    <Card aria-labelledby={`issue-${issue.key}-summary`}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PriorityIcon priority={issue.priority} />
          <KeyContent id={`issue-${issue.key}-summary`} onClick={handleIssueClick}>
            {issue.key}
          </KeyContent>
        </Box>
        <IconButton 
            aria-label="go to jira" 
            size="small" 
            onClick={handleIssueClick}
          >
            <ArrowOutward fontSize="small" />
        </IconButton>
      </Box>
      <Content>
        <Summary>
          <SummaryContent onClick={handleIssueClick}>{issue.summary}</SummaryContent>
        </Summary>
        
        <FlexContainer style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <FlexContainer>
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
          <DateBadge>{formattedDate}</DateBadge>
        </FlexContainer>
        <FlexContainer>
          {issue.storyPoints! > 0 && (
            
            <HoursBadge><AccessTime fontSize="small" sx={{color: "#9184c6"}} />
              {issue.storyPoints}
            </HoursBadge>
          )}
          {issue.lastComment && (
            <ActionButtons>
              <IconButton 
                size="small" 
                sx={{ position: 'relative' , color: "#9f96c4"}}
                onClick={toggleComment}
              >
                <Message fontSize="small" />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                  }}
                />
              </IconButton>
            </ActionButtons>
          )}
        </FlexContainer>

        </FlexContainer>

        {issue.lastComment && (
          <Collapse in={showComment} timeout="auto" unmountOnExit>
            <CommentContainer>
              <CommentHeader>
                <span>{issue.lastComment.author?.name || 'anonymus'}</span>
                <span>{formattedCommentDate}</span> 
              </CommentHeader>
              <CommentContent>
                <JiraCommentRenderer comment={issue.lastComment} /> 
              </CommentContent>
            </CommentContainer>
          </Collapse>
        )}
      </Content>
    </Card>
  );
};