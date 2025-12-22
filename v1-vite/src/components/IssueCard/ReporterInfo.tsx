import { Box, Stack, Avatar, Text, Center } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import classes from './IssueCard.module.scss';
import type { JiraIssue } from '@/types/jira';

interface ReporterInfoProps {
  reporter: JiraIssue['reporter'];
  created?: string;
}

export const ReporterInfo = ({ reporter, created }: ReporterInfoProps) => {
  return (
    <Box className={classes.reporterInfoContainer}>
      <Stack gap={6} align="center" justify="center" style={{ width: '100%' }}>
        <Text size="xs" fw={600} mb={2} style={{ letterSpacing: 0.2 }} c="#473a51">Información de creacíon</Text>
        <Center>
          <IconCalendar size={14} style={{ color: '#6B778C', marginRight: 4 }} />
          <Text size="xs" c="dimmed">
            {created ? new Date(created).toLocaleDateString() : ''}
          </Text>
        </Center>
        {reporter?.avatar ? (
          <Avatar src={reporter.avatar} size={28} radius="xl" mt={2} />
        ) : (
          <Box className={classes.avatarFallback} style={{ width: 28, height: 28, fontSize: 12, marginTop: 2 }}>
            {reporter?.initials || 'NA'}
          </Box>
        )}
        <Text size="xs" fw={500} mt={2} c="#473a51">{reporter?.name || 'anónimo'}</Text>
      </Stack>
    </Box>
  );
}; 