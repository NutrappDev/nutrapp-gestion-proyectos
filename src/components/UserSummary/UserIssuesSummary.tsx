import React, { useMemo } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useIssuesData } from '@hooks/useIssues';
import { getUserIssueCounts, UserIssueSummary } from '@/utils/issueUtils';
import { getTeamIssueCounts, TeamSummary } from '@/utils/teamIssueUtils';
import { SummaryCard } from './summaryCard';
import styled from '@emotion/styled';
import { useFiltersContext } from '@/context/FiltersContext';

const SummaryContainer = styled(Box)`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 4px;
  padding: 1rem 0;
  border-radius: 8px;
  overflow-x: auto;
`;

const SkeletonCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px;
  padding: 8px;
  border-radius: 16px;
  width: 8.5rem;
  flex-shrink: 0;
  background-color: #ffffff;
  box-shadow: 3px 3px 5px #ddd8e3, -3px -3px 5px #f3f0f7;
`;

export const UserIssuesSummary: React.FC = () => {
  const { filters } = useFiltersContext();

  const {
    data,
    isLoading,
  } = useIssuesData();

  const allIssuesFlattened = useMemo(() => {
    return data?.pages.flatMap(page => page.issues) || [];
  }, [data]);

   const isShowingTeams = useMemo(() => {
    // Mostrar por equipos si NO hay un teamId seleccionado Y NO hay un asignado individual seleccionado
    return !filters.teamId && !filters.assignee;
  }, [filters.teamId, filters.assignee]);

  // Define el tipo de summaryData para que TypeScript entienda que puede ser TeamSummary[] o UserIssueSummary[]
  const summaryData: (TeamSummary | UserIssueSummary)[] = useMemo(() => {
    if (isShowingTeams) {
      return getTeamIssueCounts(allIssuesFlattened);
    } else {
      return getUserIssueCounts(allIssuesFlattened);
    }
  }, [allIssuesFlattened, isShowingTeams]);

  const skeletonCount = 2;

  if (isLoading) {
    return (
      <SummaryContainer>
        {Array.from(new Array(skeletonCount)).map((_, index) => (
          <SkeletonCardContainer key={index}>
            <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: '4px' }} />
            <Skeleton variant="circular" width={'2.7rem'} height={'2.7rem'} sx={{ marginBottom: '8px' }} />
            <Box display="flex" justifyContent="center" sx={{ marginBottom: '4px', padding:'0.3rem' }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ margin: '2px' }} />
              <Skeleton variant="circular" width={24} height={24} sx={{ margin: '2px' }} />
              <Skeleton variant="circular" width={24} height={24} sx={{ margin: '2px' }} />
            </Box>
          </SkeletonCardContainer>
        ))}
      </SummaryContainer>
    );
  }

  // if (isError) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="100px" color="error.main">
  //       <Typography variant="body1">Error al cargar el resumen de usuarios: {error?.message}</Typography>
  //     </Box>
  //   );
  // }

  // if (userIssueCounts.length === 0) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" height="100px">
  //       <Typography variant="body1" color="textSecondary">No se encontraron usuarios con incidencias.</Typography>
  //     </Box>
  //   );
  // }

  return (
    <SummaryContainer>
      {summaryData.map(item => (
        <SummaryCard
          key={'id' in item ? item.id : item.name} 
          name={item.name}
          avatarUrl={'avatar' in item ? item.avatar : undefined} 
          initials={item.initials}
          counts={item.counts}
        />
      ))}
    </SummaryContainer>
  );
};