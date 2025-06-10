import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: transparent;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #555;
  font-weight: 500;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 4px;
`;

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
    <PaginationContainer>
      <PageInfo>
        Página {currentPage} de {totalPages} • {totalItems} incidencias
      </PageInfo>
      
      <NavigationButtons>
        <IconButton 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          size="small"
          aria-label="Primera página"
        >
          <FirstPage fontSize="small" />
        </IconButton>
        
        <IconButton 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
          aria-label="Página anterior"
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        
        <IconButton 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLast}
          size="small"
          aria-label="Página siguiente"
        >
          <ChevronRight fontSize="small" />
        </IconButton>
        
        <IconButton 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLast}
          size="small"
          aria-label="Última página"
        >
          <LastPage fontSize="small" />
        </IconButton>
      </NavigationButtons>
    </PaginationContainer>
  );
};