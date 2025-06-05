import styled from '@emotion/styled';
import { PriorityHigh, Remove, ArrowDownward } from '@mui/icons-material';

interface PriorityIconProps {
  priority: string;
}

const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
`;

const getPriorityIcon = (priority: string) => {
  const lowerPriority = priority.toLowerCase();
  
  if (lowerPriority.includes('alta') || lowerPriority.includes('high')) {
    return <PriorityHigh color="error" />;
  }
  if (lowerPriority.includes('media') || lowerPriority.includes('medium')) {
    return <Remove color="warning" />;
  }
  return <ArrowDownward color="success" />;
};

export const PriorityIcon = ({ priority }: PriorityIconProps) => (
  <IconContainer aria-label={`Prioridad ${priority}`}>
    {getPriorityIcon(priority)}
  </IconContainer>
);