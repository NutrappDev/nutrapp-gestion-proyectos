import { Box, Text } from '@mantine/core';
import styles from './PriorityIcon.module.scss';

interface PriorityIconProps {
  priority: string;
  showPriorityBar?: boolean;
}

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
        <div className={styles.priorityBarContainer}>
          {priorityLevels.map((level, index) => (
            <div key={index} className={styles.priorityBar} style={{ backgroundColor: PRIORITY_COLORS[level] }} />
          ))}
        </div>
      ) : (
        <Box className={styles.priorityContainer} data-priority={priority.toLowerCase()}>
          <Box className={styles.priorityDot} data-priority={priority.toLowerCase()} />
          <Text fw={700} size="xs" className={styles.priorityText} data-priority={priority.toLowerCase()}>{priority}</Text>
        </Box>
      )}
    </>
  );
};