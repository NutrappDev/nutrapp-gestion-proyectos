import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

interface PriorityIconProps {
  priority: string;
  showPriorityBar?: boolean;
}

const PriorityContainer = styled(Box)<{ priority: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.priority.toLowerCase()) {
      case 'muy alta':
        return '#FFF1F2';
      case 'alta':
        return '#FFF3E0';
      case 'normal':
        return '#E8F5E9';
      default:
        return '#F5F5F5';
    }
  }};
`;

const PriorityDot = styled(Box)<{ priority: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.priority.toLowerCase()) {
      case 'muy alta':
        return '#FF3A55';
      case 'alta':
        return '#FF9800';
      case 'normal':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  }};
`;

const PriorityText = styled(Typography)<{ priority: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => {
    switch (props.priority.toLowerCase()) {
      case 'muy alta':
        return '#FF3A55';
      case 'alta':
        return '#FF9800';
      case 'normal':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  }};
`;

const PriorityBarContainer = styled.div`
  display: flex;
  height: 4px;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const PriorityBar = styled.div<{ $priorityColor: string }>`
  flex: 1;
  background-color: ${props => props.$priorityColor};
`;

const PRIORITY_COLORS = {
  normal: '#5fd79b',
  alta: '#ffbd56',
  muyAlta: '#fa4848'
};

const getPriorityLevels = (priority: string): ('normal' | 'alta' | 'muyAlta')[] => {
  switch (priority.toLowerCase()) {
    case 'muy alta':
      return ['normal', 'alta', 'muyAlta'];
    case 'alta':
      return ['normal', 'alta'];
    case 'normal':
      return ['normal'];
    default:
      return [];
  }
};

export const PriorityIcon = ({ priority, showPriorityBar = false }: PriorityIconProps) => {
  const priorityLevels = getPriorityLevels(priority);

  return (
    <>
      {showPriorityBar && priorityLevels.length > 0 ? (
        <PriorityBarContainer>
          {priorityLevels.map((level, index) => (
            <PriorityBar key={index} $priorityColor={PRIORITY_COLORS[level]} />
          ))}
        </PriorityBarContainer>
      ): 
      <PriorityContainer priority={priority}>
        <PriorityDot priority={priority} />
        <PriorityText priority={priority}>
          {priority}
        </PriorityText>
      </PriorityContainer>
      }
      
    </>
  );
};