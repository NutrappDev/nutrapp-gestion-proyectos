import { Group, Text, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons-react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  isLast: boolean;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalItems,
  pageSize,
  isLast,
  onPageChange
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Group justify="space-between" p="md" mb="md">
      <Text size="sm" c="dimmed" fw={500}>
        Página {currentPage} de {totalPages} • {totalItems} incidencias
      </Text>
      
      <Group gap={4}>
        <ActionIcon 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          size="sm"
          variant="subtle"
          aria-label="Primera página"
        >
          <IconPlayerSkipBack size={16} />
        </ActionIcon>
        
        <ActionIcon 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="sm"
          variant="subtle"
          aria-label="Página anterior"
        >
          <IconChevronLeft size={16} />
        </ActionIcon>
        
        <ActionIcon 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLast}
          size="sm"
          variant="subtle"
          aria-label="Página siguiente"
        >
          <IconChevronRight size={16} />
        </ActionIcon>
        
        <ActionIcon 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLast}
          size="sm"
          variant="subtle"
          aria-label="Última página"
        >
          <IconPlayerSkipForward size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
};