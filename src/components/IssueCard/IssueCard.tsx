import {
  IconArrowUpRight,
  IconClock,
  IconMessage,
  IconInfoCircle,
  IconMessagePlus
} from '@tabler/icons-react';
import type { JiraIssue } from '@/types/jira';
import {
  Paper,
  Box,
  Avatar,
  Text,
  Group,
  ActionIcon,
  Collapse,
  Autocomplete,
  Select,
  Button
} from '@mantine/core';
import { PriorityIcon } from './PriorityIcon';
import { useState, useMemo } from 'react';
import { JiraCommentRenderer } from './JiraCommentRenderer';
import { useFiltersContext } from '@/context/FiltersContext';
import classes from './IssueCard.module.scss';
import { ReporterInfo } from './ReporterInfo';
import { findTeamByAssignee, TEAMS } from '@/constants/team';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addCommentToIssues } from '@/api/jiraApi';

interface IssueCardProps {
  issue: JiraIssue;
  columnId: string;
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

export const IssueCard = ({ issue, columnId }: IssueCardProps) => {
  const { filters, updateFilter } = useFiltersContext();
  const [showComment, setShowComment] = useState(false);
  const [plusComment, setPlusComment] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const initials = issue.assignee?.initials || 'NA';
  const bgColor = stringToColor(initials);

  // --- Sortable ---
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: issue.key,
      data: { issue, columnId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formattedDate = issue.duedate
    ? `${issue.duedate.slice(8, 10)}/${issue.duedate.slice(5, 7)}`
    : 'Sin fecha';

  const handleAssigneeClickv2 = () => {
    const isCurrentlyShowingTeams = !filters.teamId && !filters.assignee;

    if (isCurrentlyShowingTeams) {
      const clickedTeam = TEAMS.find((team) => team.name === issue.assignee?.name);
      if (clickedTeam) {
        updateFilter('teamId', clickedTeam.id);
        updateFilter('assignee', undefined);
      } else {
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

  const assigneeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    TEAMS.forEach((team) => {
      team.members
        .sort((a, b) => a.localeCompare(b))
        .forEach((member) => {
          options.push({ value: member.toUpperCase(), label: member.toUpperCase() });
        });
    });
    return options;
  }, []);

  const handleAddComment = async () => {
    if (!author || !message) {
      console.warn("Debes seleccionar un autor y escribir un mensaje");
      return;
    }
    try {
      const fullMessage = `${author}: ${message}`;
      const newComment = await addCommentToIssues(issue.id, fullMessage);
      console.log("Comentario añadido:", newComment);
      setMessage('');
      setAuthor('');
      setPlusComment(false); 
      console.log("Comentario añadido:", newComment)
    } catch (err) {
      console.error("Error al actualizar en backend:", err);
    }
  }

  return (
    <Paper
      unstyled
      className={classes.card}
      radius={24}
      ref={setNodeRef}
      style={style}
    >
      {/* Header (Drag handle) */}
      <Box className={classes.header} {...attributes} {...listeners}  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
        <Group gap={4}>
          <PriorityIcon priority={issue.priority} />
          <Text
            unstyled
            className={classes.keyContent}
            onClick={() => window.open(issue.url, '_blank')}
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

      {/* Content */}
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
            <Text unstyled className={classes.dateBadge}>
              {formattedDate}
            </Text>
          </Group>

          <Group gap={8}>
            {(issue.storyPoints ?? 0) > 0 && (
              <Text unstyled className={classes.hoursBadge}>
                <IconClock size={20} className={classes.clockIcon} />
                {issue.storyPoints}
              </Text>
            )}

            {issue.lastComment ? (
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
            ):(
              <ActionIcon
                unstyled
                size={20}
                className={classes.commentButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setPlusComment(!plusComment);
                }}
              >
                <IconMessagePlus size={20} />
              </ActionIcon>
            )}

            {issue.reporter && (
              <ActionIcon
                unstyled
                size={20}
                className={classes.infoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreInfo((o) => !o);
                }}
                title="Ver información de la incidencia"
              >
                <IconInfoCircle size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        {/* Reporter Info */}
        {issue.reporter && (
          <Collapse in={showMoreInfo}>
            <ReporterInfo reporter={issue.reporter} created={issue.created} />
          </Collapse>
        )}

        {/* Último comentario */}
        {issue.lastComment ? (
          <Collapse in={showComment}>
            <Box className={classes.commentContainer}>
              <Group
                justify="space-between"
                mb={8}
                className={classes.commentHeader}
              >
                <Text size="xs">{issue.lastComment.author?.name || 'anonymus'}</Text>
                <Text size="xs">
                  {issue.lastComment.created
                    ? new Date(issue.lastComment.created).toLocaleDateString()
                    : ''}
                </Text>
              </Group>
              <Box className={classes.commentContent}>
                <JiraCommentRenderer comment={issue.lastComment} />
              </Box>
            </Box>
          </Collapse>
        ):(
          <Collapse in={plusComment}>
            <Box className={classes.commentContainer}>
              <Group
                justify="space-between"
                mb={8}
                className={classes.commentHeader}
              >
                <Text size="xs">Nuevo comentario</Text>
                <Text size="xs">{new Date().toLocaleString()}</Text>
              </Group>
              <Box className={classes.commentContent}>
                <Select
                  mt="md"
                  comboboxProps={{ withinPortal: true }}
                  data={[{ value: '', label: 'Todos los asignados' }, ...assigneeOptions]}
                  placeholder="Author"
                  label="Author"
                  value={author}
                  onChange={(value) => setAuthor(value || '')}
                  classNames={classes}
                />
                <Autocomplete
                  mt="md"
                  label="Mensaje"
                  placeholder="Escribe tu mensaje"
                  value={message}
                  onChange={setMessage}
                />
                <Button
                  mt="md"
                  size="xs"
                  radius="xl"
                  variant="light"
                  onClick={handleAddComment}
                >
                  Agregar comentario
                </Button>
              </Box>
            </Box>
          </Collapse>
        )}
      </Box>
    </Paper>
  );
};
