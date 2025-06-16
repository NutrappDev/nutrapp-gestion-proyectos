import React, { useMemo } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useIssuesData } from '@hooks/useIssues';
import { getUserIssueCounts } from '@/utils/issueUtils';
import { UserAvatarCard } from './UserAvatarCard';
import styled from '@emotion/styled';

const SummaryContainer = styled(Box)`
  display: flex;
  width: fit-content;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 4px;
  padding-bottom: 1rem;
  margin: 0 1rem;
  border-radius: 8px;
  overflow-x: auto;
`;

const SkeletonCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px;
  padding: 8px;
  border-radius: 22px;
  width: 100px;
  flex-shrink: 0;
  background-color: #ffffff;
  box-shadow: 3px 3px 5px #ddd8e3, -3px -3px 5px #f3f0f7;
`;

export const UserIssuesSummary: React.FC = () => {
  // const { filters } = useFiltersContext();

  const {
    data,
    isLoading,
  } = useIssuesData();

  const allIssuesFlattened = useMemo(() => {
    return data?.pages.flatMap(page => page.issues) || [];
  }, [data]);

  const userIssueCounts = useMemo(() => {
    return getUserIssueCounts(allIssuesFlattened);
  }, [allIssuesFlattened]);

  const skeletonCount = 2;

  if (isLoading) {
    return (
      <SummaryContainer>
        {Array.from(new Array(skeletonCount)).map((_, index) => (
          <SkeletonCardContainer key={index}>
            <Skeleton variant="circular" width={40} height={40} sx={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: '4px' }} />
            <Box display="flex" justifyContent="center" marginTop="8px">
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
      {userIssueCounts.map(user => (
        <UserAvatarCard
          key={user.name}
          name={user.name}
          avatarUrl={user.avatar}
          initials={user.initials}
          counts={user.counts}
        />
      ))}
    </SummaryContainer>
  );
};