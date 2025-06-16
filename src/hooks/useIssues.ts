import { useInfiniteQuery } from '@tanstack/react-query';
export type { FetchIssuesResponse } from '@/api/jiraApi';
import { fetchIssues } from '@/api/jiraApi';
import { useFiltersContext } from '@/context/FiltersContext';
import { TEAM_DEVELOPMENT } from '@/constants/team';

export const useIssuesData = (status?: string ) => {
  const { filters, pageSize } = useFiltersContext();

  return useInfiniteQuery({
    queryKey: ['issues', filters, status],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchIssues({
        project: filters.project,
        assignee: filters.assignee ?? TEAM_DEVELOPMENT,
        status,
        page: pageParam,
        pageSize: pageSize
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.isLast) return undefined;
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos de cache
  });
};
