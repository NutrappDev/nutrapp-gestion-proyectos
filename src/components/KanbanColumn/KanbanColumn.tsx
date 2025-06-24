import { useMemo } from 'react';
import { IconClock } from '@tabler/icons-react';
import { IssueCard } from '../IssueCard/IssueCard';
import type { JiraIssue } from '../../types/jira';
import { IssueSkeleton } from '../UI/IssueSkeleton/IssueSkeleton';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { calculateTotalHours } from '@/utils/issueFilters';
import classes from './KanbanColumn.module.scss';

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
  const sentinelRef = useInfiniteScroll(
    loadMoreIssues,
    isFetchingNextPage || isLoading,
    hasNextPage
  );

  const totalHours = useMemo(() => calculateTotalHours(data.issues), [data.issues]);

  return (
    <div 
      className={classes.columnContainer}
      style={{
        '--bg-color': bgColor,
        '--border-color': borderColor,
        '--light-bg-color': lightBgColor,
        '--title-color': titleColor,
      } as React.CSSProperties}
      aria-label={`Columna ${title}`}
    >
      <div className={classes.columnHeaderWrapper}>
        <span className={classes.countBadge}>
          {data.total}
        </span>
        <h2 className={classes.columnHeader}>
          {title}
        </h2>
        <span className={classes.hoursBadge}>
          {totalHours}
          <IconClock size={20} />
        </span>
      </div>
      <div className={classes.columnContent}>
        <div className={classes.issuesList}>
          {data.issues.map((issue) => (
            <IssueCard key={`${issue.id} ${issue.key}`} issue={issue} />
          ))}

          {isLoading && data.issues.length === 0 && (
            <>
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
            </>
          )}

          {(isLoading || hasNextPage) && data.issues.length > 0 && (
            <IssueSkeleton />
          )}

          {hasNextPage && (
            <div ref={sentinelRef} style={{ height: '1px' }} />
          )}
        </div>
      </div>
    </div>
  );
};