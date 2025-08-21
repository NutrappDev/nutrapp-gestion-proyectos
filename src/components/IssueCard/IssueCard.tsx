import { IconArrowUpRight, IconClock, IconMessage, IconInfoCircle } from '@tabler/icons-react';
import type { JiraIssue } from '@/types/jira';
import { Paper, Box, Avatar, Text, Group, ActionIcon, Collapse } from '@mantine/core';
import { PriorityIcon } from './PriorityIcon';
import { useState } from 'react';
import { JiraCommentRenderer } from './JiraCommentRenderer';
import { useFiltersContext } from '@/context/FiltersContext';
import classes from './IssueCard.module.scss';
import { ReporterInfo } from './ReporterInfo';
import { findTeamByAssignee, TEAMS } from '@/constants/team';

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
  const { filters, updateFilter } = useFiltersContext(); 
  const [showComment, setShowComment] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
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

    const handleAssigneeClickv2 = () => {
      console.log('dadadada')
      const isCurrentlyShowingTeams = !filters.teamId && !filters.assignee;
      if (isCurrentlyShowingTeams) {
        const clickedTeam = TEAMS.find(team => team.name === issue.assignee?.name);
        if (clickedTeam) {
          updateFilter('teamId', clickedTeam.id);
          updateFilter('assignee', undefined);
        } else {
          console.warn("Clicked on a user card when in 'all teams' mode. Ignoring.");
          updateFilter('assignee', issue.assignee?.name);
          updateFilter('teamId', undefined);
        }
      } else {
        if (filters.assignee === issue.assignee?.name) {
          updateFilter('assignee', undefined);
          updateFilter('teamId', undefined);
        } else {
          updateFilter('assignee', issue.assignee?.name);
          const team = findTeamByAssignee(issue.assignee?.name || '');
          updateFilter('teamId', team ? team.id : undefined);
        }
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
                onClick={handleAssigneeClickv2}
              />
            ) : (
              <Box 
                className={classes.avatarFallback}
                bg={bgColor}
                onClick={handleAssigneeClickv2}
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
            {issue.reporter && (
              <ActionIcon
                unstyled
                size={20}
                className={classes.infoButton}
                onClick={e => {
                  e.stopPropagation();
                  setShowMoreInfo(o => !o);
                }}
                title="Ver información de la incidencia"
              >
                <IconInfoCircle size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>


        {issue.reporter && (
          <Collapse in={showMoreInfo}>
            <ReporterInfo reporter={issue.reporter} created={issue.created} />
          </Collapse>
        )}
        {issue.lastComment && (
          <Collapse in={showComment}>
            <Box className={classes.commentContainer}>
              <Group justify="space-between" mb={8} className={classes.commentHeader}>
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