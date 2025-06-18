import React, { useState } from 'react';
import { Avatar, Typography, Box, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { UserIssueCountsByCategory } from '@/utils/issueUtils';
import { useFiltersContext } from '@/context/FiltersContext';

interface UserAvatarCardProps {
  name: string;
  avatarUrl: string;
  initials: string;
  counts: UserIssueCountsByCategory;
}

const CardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px;
  padding: 8px;
  border-radius: 16px;
  width: 8.5rem;
  flex-shrink: 0;
  background-color: #fbf8ff;
  background: linear-gradient(309deg, #ffffff, #f6f3fa99);
  border: 1px solid #eae9eba1;
  box-shadow: 0px 4px 12px rgb(150 141 161 / 22%), -4px -4px 4px #ffff;;
  transition: box-shadow transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-1px); 
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const FlipContainer = styled(Box)`
  width: 2.7rem;
  height: 2.7rem;
  margin-bottom: 8px;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
`;

const FlipCardInner = styled(Box)<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const FlipCardFace = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
`;

const FlipCardBack = styled(FlipCardFace)`
  background-color: #3f3ead;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  transform: rotateY(180deg);
`;

const StyledAvatar = styled(Avatar)`
  width: 100%;
  height: 100%;
`;

interface CountCircleProps {
  backgroundColor: string;
}

const CountCircle = styled(Box)<CountCircleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
  margin: 2px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const CountsRow = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding: 0.3rem;
  border-radius: 1rem;
  background-color: #e7ebf8cf;
`;

export const UserAvatarCard: React.FC<UserAvatarCardProps> = ({ name, avatarUrl, initials, counts }) => {
  const { updateFilter: updateAssigneeFilter } = useFiltersContext();
  const [isFlipped, setIsFlipped] = useState(false);

  const colors = {
    backlog: '#3f3ead',
    inProgress: '#fab744',
    detained: '#ff3a55e6',
  };
  const handleAssigneeClick = () => {
    if (name) {
      updateAssigneeFilter('assignee', name);
    }
  };

  return (
    <CardContainer>
      <Typography variant="body2" align="center" noWrap sx={{ 
        width: '100%', 
        fontSize: '0.7rem',
        color: '#948a9b',
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>
        {name.split(' ')[0]}
      </Typography>
      <Tooltip title={name} arrow placement="top">
        <FlipContainer
          onClick={handleAssigneeClick}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <FlipCardInner $isFlipped={isFlipped}>
            <FlipCardFace>
              <StyledAvatar
                alt={name}
                src={avatarUrl || undefined}
              >
                {initials}
              </StyledAvatar>
            </FlipCardFace>

            <FlipCardBack>
              {counts.total- counts.awaitingApproval}
            </FlipCardBack>
          </FlipCardInner>
        </FlipContainer>
      </Tooltip>
      
      <CountsRow>
        <CountCircle backgroundColor={colors.backlog}>
          {counts.backlog}
        </CountCircle>

        <CountCircle backgroundColor={colors.inProgress}>
          {counts.inProgress}
        </CountCircle>

        <CountCircle backgroundColor={colors.detained}>
          {counts.detained}
        </CountCircle>

      </CountsRow>
    </CardContainer>
  );
};