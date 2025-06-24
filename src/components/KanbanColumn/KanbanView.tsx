import React, { useCallback, useMemo } from 'react';
import { useIssuesData } from '@hooks/useIssues';
import { KanbanColumn } from '@components/KanbanColumn/KanbanColumn';
import classes from '../../pages/Dashboard/Dashboard.module.scss'

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


  const getIssuesAndTotal = (status: 'Por hacer' | 'En curso' | 'Esperando aprobación' | 'Detenida') => {
    const issues = data?.pages.flatMap(page => page.data[status]?.issues || []) || [];
    const total = data?.pages.reduce((sum, page) => sum + (page.data[status]?.total || 0), 0) || 0;
    return { issues, total };
  };

  const todoIssues = useMemo(() => getIssuesAndTotal('Por hacer'), [data]);
  const inProgressIssues = useMemo(() => getIssuesAndTotal('En curso'), [data]);
  const awaitingApprovalIssues = useMemo(() => getIssuesAndTotal('Esperando aprobación'), [data]);
  const detainedIssues = useMemo(() => getIssuesAndTotal('Detenida'), [data]);

  const loadMoreIssues = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);


  if (isError) {
    return <div className={classes.errorMessage}>Error al cargar incidencias: {error?.message || 'Error desconocido'}</div>;
  }

  return (
    <div className={classes.columnsContainer}>
      <KanbanColumn
        title="Backlog"
        data={todoIssues}
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
        data={inProgressIssues}
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
        data={awaitingApprovalIssues}
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
        data={detainedIssues}
        titleColor="#ffffff"
        borderColor="#ef496f"
        bgColor="#e4484b"
        lightBgColor="#F6F6FA"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreIssues={loadMoreIssues}
        isLoading={isLoading}
      />
    </div>
  );
};