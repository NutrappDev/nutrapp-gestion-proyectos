import React, { useCallback, useMemo } from 'react';
import { useIssuesData } from '@hooks/useIssues';
import { useFiltersContext } from '@/context/FiltersContext';
import { KanbanColumn } from '@components/KanbanColumn/KanbanColumn';
import {
  filterTodoIssues,
  filterInProgressIssues,
  filterAwaitingApprovalIssues,
  filterDetainedIssues,
  calculateTotalHours,
} from '@utils/issueFilters';
import { ColumnsContainer, ErrorMessage } from '../../pages/Dashboard/Dashboard.styles';

export const KanbanView: React.FC = () => {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useIssuesData();

  const { updateFilter } = useFiltersContext();

  const allIssuesFlattened = useMemo(() => {
    console.log('data', data);
    return data?.pages.flatMap(page => page.issues) || [];
  }, [data]);

  const loadMoreIssues = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const todoIssues = useMemo(() => filterTodoIssues(allIssuesFlattened), [allIssuesFlattened]);
  const inProgressIssues = useMemo(() => filterInProgressIssues(allIssuesFlattened), [allIssuesFlattened]);
  const awaitingApprovalIssues = useMemo(() => filterAwaitingApprovalIssues(allIssuesFlattened), [allIssuesFlattened]);
  const detainedIssues = useMemo(() => filterDetainedIssues(allIssuesFlattened), [allIssuesFlattened]);

  const totalTodoHours = useMemo(() => calculateTotalHours(todoIssues), [todoIssues]);
  const totalInProgressHours = useMemo(() => calculateTotalHours(inProgressIssues), [inProgressIssues]);
  const totalDoneHours = useMemo(() => calculateTotalHours(awaitingApprovalIssues), [awaitingApprovalIssues]);
  const totalCancelHours = useMemo(() => calculateTotalHours(detainedIssues), [detainedIssues]);

  if (isError) {
    return <ErrorMessage>Error al cargar incidencias: {error?.message || 'Error desconocido'}</ErrorMessage>;
  }

  return (
    <ColumnsContainer>
      <KanbanColumn
        title="Backlog"
        issues={todoIssues}
        onFilterChange={updateFilter}
        totalHours={totalTodoHours}
        titleColor="#ffffff"
        borderColor="#857C99"
        bgColor="#3f3ead"
        lightBgColor="#F6F6FA"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreIssues={loadMoreIssues}
        isLoading={isLoading}
      />
      <KanbanColumn
        title="En progreso"
        issues={inProgressIssues}
        onFilterChange={updateFilter}
        totalHours={totalInProgressHours}
        titleColor="#ffffff"
        borderColor="#f6b46b"
        bgColor="#f3b03f"
        lightBgColor="#F6F6FA"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreIssues={loadMoreIssues}
        isLoading={isLoading}
      />
      <KanbanColumn
        title="Esperando Aprobacion"
        issues={awaitingApprovalIssues}
        onFilterChange={updateFilter}
        totalHours={totalDoneHours}
        titleColor="#ffffff"
        borderColor="#65D9A9"
        bgColor="#22C55E"
        lightBgColor="#F6F6FA"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreIssues={loadMoreIssues}
        isLoading={isLoading}
      />
      <KanbanColumn
        title="Detenido"
        issues={detainedIssues}
        onFilterChange={updateFilter}
        totalHours={totalCancelHours}
        titleColor="#ffffff"
        borderColor="#ef496f"
        bgColor="#e4484b"
        lightBgColor="#F6F6FA"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreIssues={loadMoreIssues}
        isLoading={isLoading}
      />
    </ColumnsContainer>
  );
};