import React, { useState } from 'react';
import { Avatar, Box, Text, Tooltip } from '@mantine/core';
import { UserIssueCountsByCategory } from '@/utils/issueUtils';
import { useFiltersContext } from '@/context/FiltersContext';
import { findTeamByAssignee, TEAMS } from '@/constants/team';

interface UserAvatarCardProps {
  name: string;
  avatarUrl?: string;
  initials: string;
  counts: UserIssueCountsByCategory;
  selected?: boolean;
}
const avatarColors = [
  '#6C4AB6', '#3C2052', '#F7B801', '#F18701', '#F35B04', '#43BCCD', '#3A6EA5', '#FF3A55', '#FAB744', '#3F3EAD'
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

export const SummaryCard: React.FC<UserAvatarCardProps> = ({ name, avatarUrl, initials, counts, selected = false }) => {
  const { filters, updateFilter } = useFiltersContext(); 
  const [isFlipped, setIsFlipped] = useState(false);

  const colors = {
    backlog: '#3f3ead',
    inProgress: '#fab744',
    detained: '#ff3a55e6',
  };

  const handleClick = () => {
    const isCurrentlyShowingTeams = !filters.teamId && !filters.assignee;
    if (isCurrentlyShowingTeams) {
      const clickedTeam = TEAMS.find(team => team.name === name);
      if (clickedTeam) {
        updateFilter('teamId', clickedTeam.id);
        updateFilter('assignee', undefined);
      } else {
        console.warn("Clicked on a user card when in 'all teams' mode. Ignoring.");
        updateFilter('assignee', name);
        updateFilter('teamId', undefined);
      }
    } else {
      if (filters.assignee === name) {
        updateFilter('assignee', undefined);
        updateFilter('teamId', undefined);
      } else {
        updateFilter('assignee', name);
        const team = findTeamByAssignee(name || '');
        updateFilter('teamId', team ? team.id : undefined);
      }
    }
  };

  return (
    <Box
      pos="relative"
      m={8}
      w={136}
      p={8}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 16,
        flexShrink: 0,
        scrollSnapAlign: 'center',
        background: 'linear-gradient(309deg, #ffffff, #f6f3fa)',
        border: `2px solid ${selected ? '#3f3ead' : '#eae9eba1'}`,
        boxShadow: selected
          ? '0px 8px 16px 0px #3f3ead33, 0px 0px 2px 0px #3f3ead99'
          : '0px 4px 12px rgb(150 141 161 / 22%), -4px -4px 4px #ffff',
        transition: 'transform 0.3s, box-shadow 0.2s',
        animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        zIndex: 10,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >
      <Text ta="center" fz={11} fw={700} c="#948a9b" mb={4} truncate>
        {name.split(' ')[0]}
      </Text>
      <Tooltip label={name} withArrow position="top">
        <Box
          w={43}
          h={43}
          mb={8}
          pos="relative"
          style={{ perspective: 1000, cursor: 'pointer' }}
          onClick={handleClick}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <Box
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <Box
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
              }}
            >
              <Avatar
                alt={name}
                src={avatarUrl || undefined}
                size={43}
                color='#ffffff'
                style={{ fontSize:'0.8rem', backgroundColor: !avatarUrl ? getAvatarColor(name) : undefined }}
              >
                {initials}
              </Avatar>
            </Box>
            {/* Back */}
            <Box
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#3f3ead',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                transform: 'rotateY(180deg)',
              }}
            >
              {counts.total - counts.awaitingApproval}
            </Box>
          </Box>
        </Box>
      </Tooltip>
      <Box
        mt={8}
        p={4}
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 16, 
          background: '#e7ebf8cf' 
        }}
      >
        <Box
          w={24}
          h={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            background: colors.backlog,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            margin: 2,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {counts.backlog}
        </Box>
        <Box
          w={24}
          h={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            background: colors.inProgress,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            margin: 2,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {counts.inProgress}
        </Box>
        <Box
          w={24}
          h={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            background: colors.detained,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            margin: 2,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {counts.detained}
        </Box>
      </Box>
    </Box>
  );
};