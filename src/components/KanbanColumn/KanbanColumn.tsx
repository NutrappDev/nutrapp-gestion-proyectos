import styled from '@emotion/styled';
import { IssueCard } from '../IssueCard/IssueCard';
import type { JiraIssue } from '../../types/jira';
import { AccessTime } from '@mui/icons-material';
import { IssueSkeleton } from '../UI/IssueSkeleton';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

interface KanbanColumnProps {
  title: string;
  issues: JiraIssue[];
  titleColor: string;
  borderColor: string;
  bgColor: string;
  lightBgColor: string;
  totalHours?: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreIssues: () => void;
  isLoading: boolean;
}

const ColumnContainer = styled.div<{ 
  bgColor: string; 
  borderColor: string;
  lightBgColor: string;
}>`
  flex: 1;
  display: inline-grid;
  justify-content: center;
  text-align: start;
  background-color: #aab6dd2e;
  padding: 1rem 0.4rem;
  border-radius: 24px;
`;

const ColumnContent = styled.div<{borderColor: string; lightBgColor: string;}>`
  min-width: 250px;
  min-height: 300px;
  height: 80vh;
  border-radius: 12px;
  padding: 0 0.5rem;
  position: relative;
  overflow: hidden;
`;

const ColumnHeaderWrapper = styled.div<{ bgColor: string }>`
  position: relative;
  display: flex;
  margin: 0 0 12px 12px;
  padding: 5px 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;
  background-color: ${props => props.bgColor};
  gap: 8px;
`;

const ColumnHeader = styled.h2<{ titleColor: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.titleColor};
  margin: 0;
  display: inline-block;
  text-align: center;
`;

const CountBadge = styled.span<{ bgColor: string }>`
  top: 8px;
  right: 8px;
  background-color: #ffffff;
  color: #3c2052;
  border-radius: 50%;
  min-width: 30px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const IssuesList = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 12px 0;
  overflow-y: auto;
  scrollbar-width: none;
  align-items: center;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const HoursBadge = styled.span<{ titleColor: string }>`
  font-size: 0.9rem;
  gap: 2px;
  color: ${props => props.titleColor};
  padding: 2px 6px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  display: inline-flex;
`;

export const KanbanColumn = ({ 
  title, 
  issues,
  titleColor,
  borderColor,
  bgColor,
  lightBgColor,
  totalHours = 0,
  hasNextPage,
  isFetchingNextPage,
  loadMoreIssues,
  isLoading,
}: KanbanColumnProps) => {

  const sentinelRef = useInfiniteScroll(loadMoreIssues, isFetchingNextPage || isLoading, hasNextPage);

  return (
    <ColumnContainer 
      aria-label={`Columna ${title}`}
      bgColor={bgColor}
      borderColor={borderColor}
      lightBgColor={lightBgColor}
    >
      <ColumnHeaderWrapper bgColor={bgColor}>
        <CountBadge bgColor={borderColor}>
          {issues.length}
        </CountBadge>
        <ColumnHeader titleColor={titleColor} >
          {title}
        </ColumnHeader>
        <HoursBadge titleColor={titleColor}>{totalHours}<AccessTime fontSize="small"/></HoursBadge> 
      </ColumnHeaderWrapper>
      <ColumnContent borderColor={borderColor} lightBgColor={lightBgColor} >
        <IssuesList>
          {issues.map(issue => (
            <IssueCard key={`${issue.id} ${issue.key}`} issue={issue}/>
          ))}
          
          {(isLoading) && 
            <>
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
            </>
          }

          {hasNextPage && (
            <div ref={sentinelRef} style={{ height: '1px' }} />
          )}

        </IssuesList>
      </ColumnContent>
    </ColumnContainer>
  );
};