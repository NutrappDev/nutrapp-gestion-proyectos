import { IconArrowUpRight, IconClock, IconMessage } from '@tabler/icons-react';
import type { JiraIssue } from '@/types/jira';
import { Paper, Box, Avatar, Text, Group, ActionIcon, Collapse } from '@mantine/core';
import { PriorityIcon } from './PriorityIcon';
import { useState } from 'react';
import { JiraCommentRenderer } from '../UI/JiraCommentRenderer';
import { useFiltersContext } from '@/context/FiltersContext';
import classes from './IssueCard.module.scss';

interface IssueCardProps {
  issue: JiraIssue;
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
  const { updateFilter } = useFiltersContext();
  const [showComment, setShowComment] = useState(false);
  const initials = issue.assignee?.initials || 'NA';
  const bgColor = stringToColor(initials);

  const formattedDate = issue.duedate 
    ? `${issue.duedate.slice(8, 10)}/${issue.duedate.slice(5, 7)}`
    : 'Sin fecha';

  const handleAssigneeClick = () => {
    if (issue.assignee?.name) {
      updateFilter('assignee', issue.assignee.name);
    }
  };

  return (
    <Paper unstyled className={classes.card} radius={24}>
      <Box className={classes.header}>
        <Group gap={4}>
          <PriorityIcon priority={issue.priority} />
          <Text 
            unstyled
            className={classes.keyContent}
            onClick={() => window.open(issue.url, '_blank')}
            style={{}}
          >
            {issue.key}
          </Text>
        </Group>
        <ActionIcon
          unstyled
          size="sm"
          className={classes.externalLink}
          onClick={() => window.open(issue.url, '_blank')}
        >
          <IconArrowUpRight size={18} />
        </ActionIcon>
      </Box>

      <Box className={classes.content}>
        <Text
          unstyled
          className={classes.summary}
          onClick={() => window.open(issue.url, '_blank')}
        >
          {issue.summary}
        </Text>

        <Group justify="space-between" mt={8}>
          <Group gap={8}>
            {issue.assignee?.avatar ? (
              <Avatar
                src={issue.assignee.avatar}
                size={30}
                radius="xl"
                className={classes.avatar}
                onClick={handleAssigneeClick}
              />
            ) : (
              <Box 
                className={classes.avatarFallback}
                bg={bgColor}
                onClick={handleAssigneeClick}
              >
                {initials}
              </Box>
            )}
            <Text unstyled className={classes.dateBadge}>{formattedDate}</Text>
          </Group>

          <Group gap={8}>
            {issue.storyPoints! > 0 && (
              <Text  unstyled className={classes.hoursBadge}>
                <IconClock size={20} className={classes.clockIcon} />
                {issue.storyPoints}
              </Text>
            )}
            {issue.lastComment && (
              <ActionIcon 
                unstyled
                size={20}
                className={classes.commentButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComment(!showComment);
                }}
              >
                <IconMessage size={20} />
                <Box className={classes.commentIndicator} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        {issue.lastComment && (
          <Collapse in={showComment}>
            <Box className={classes.commentContainer}>
              <Group justify="space-between" className={classes.commentHeader}>
                <Text size="xs">{issue.lastComment.author?.name || 'anonymus'}</Text>
                <Text size="xs">
                  {issue.lastComment.created ? new Date(issue.lastComment.created).toLocaleDateString() : ''}
                </Text>
              </Group>
              <Box className={classes.commentContent}>
                <JiraCommentRenderer comment={issue.lastComment} />
              </Box>
            </Box>
          </Collapse>
        )}
      </Box>
    </Paper>
  );
};