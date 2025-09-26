import { useMemo } from 'react';
import { IconClock } from '@tabler/icons-react';
import { IssueCard } from '../IssueCard/IssueCard';
import type { JiraIssue } from '../../types/jira';
import { IssueSkeleton } from '../UI/IssueSkeleton/IssueSkeleton';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { calculateTotalHours } from '@/utils/issueFilters';
import classes from './KanbanColumn.module.scss';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  title: string;
  data: { issues: JiraIssue[]; total: number };
  titleColor: string;
  borderColor: string;
  bgColor: string;
  lightBgColor: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreIssues: () => void;
  isLoading: boolean;
}

export const KanbanColumn = ({
  title,
  data,
  titleColor,
  borderColor,
  bgColor,
  lightBgColor,
  hasNextPage,
  isFetchingNextPage,
  loadMoreIssues,
  isLoading,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: title, 
    data: { columnId: title },
  });

  const sentinelRef = useInfiniteScroll(
    loadMoreIssues,
    isFetchingNextPage || isLoading,
    hasNextPage
  );

  const totalHours = useMemo(() => calculateTotalHours(data.issues), [data.issues]);

  return (
    <div
      ref={setNodeRef}
      className={`${classes.columnContainer} ${isOver ? classes.isOver : ''}`}
      style={
        {
          '--bg-color': bgColor,
          '--border-color': borderColor,
          '--light-bg-color': lightBgColor,
          '--title-color': titleColor,
        } as React.CSSProperties
      }
      aria-label={`Columna ${title}`}
    >
      {/* Encabezado */}
      <div className={classes.columnHeaderWrapper}>
        <span className={classes.countBadge}>{data.total}</span>
        <h2 className={classes.columnHeader}>{title}</h2>
        <span className={classes.hoursBadge}>
          {totalHours}
          <IconClock size={20} />
        </span>
      </div>

      {/* Contenido */}
      <div className={classes.columnContent}>
        <div className={classes.issuesList}>
          {/* Sortable context para habilitar ordenamiento en esta columna */}
          <SortableContext
            id={title}
            items={data.issues.map((i) => i.key)} // IDs únicos de cada issue
            strategy={verticalListSortingStrategy}
          >
            {data.issues.map((issue) => (
              <IssueCard
                key={issue.key}
                issue={issue}
                columnId={title} // <-- muy importante para saber de qué columna viene
              />
            ))}
          </SortableContext>

          {/* Skeletons mientras carga */}
          {isLoading && data.issues.length === 0 && (
            <>
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
            </>
          )}

          {(isLoading || hasNextPage) && data.issues.length > 0 && <IssueSkeleton />}

          {hasNextPage && <div ref={sentinelRef} style={{ height: '1px' }} />}
        </div>
      </div>
    </div>
  );
};
