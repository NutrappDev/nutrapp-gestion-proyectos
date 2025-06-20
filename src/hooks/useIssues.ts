import { useInfiniteQuery } from '@tanstack/react-query';
export type { FetchIssuesResponse } from '@/api/jiraApi';
import { fetchIssues } from '@/api/jiraApi';
import { useFiltersContext } from '@/context/FiltersContext';
import { ALL_ASSIGNEES } from '@/constants/team';

export const useIssuesData = (status?: string ) => {
  const { filters, pageSize, getSelectedTeamMembers } = useFiltersContext();

 return useInfiniteQuery({
    queryKey: ['issues', filters, status],
    queryFn: async ({ pageParam = 1 }) => {
      let assigneesToSend: string | string[] | undefined;
      if (filters.assignee) {
        assigneesToSend = filters.assignee;
      } else {
        const teamMembers = getSelectedTeamMembers();
        if (teamMembers) {
          assigneesToSend = teamMembers;
        } else {
          assigneesToSend = ALL_ASSIGNEES;
        }
      }

      return fetchIssues({
        project: filters.project,
        assignee: assigneesToSend,
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