import styled from '@emotion/styled';
import { IssueCard } from '../IssueCard/IssueCard';
import type { JiraIssue } from '../../types/jira';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import {AccessTime} from '@mui/icons-material'
import { IssueSkeleton } from '../IssueSkeleton';

interface KanbanColumnProps {
  title: string;
  issues: JiraIssue[];
  onFilterChange: (key: 'project' | 'assignee', value: string) => void;
  titleColor: string;
  borderColor: string;
  bgColor: string;
  lightBgColor: string;
  totalHours?: number;
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
`;

const ColumnContent = styled.div<{borderColor: string; lightBgColor: string;}>`
  min-width: 320px;
  width: 30vw;
  min-height: 300px;
  height: 60vh;
  background: ${props => props.lightBgColor};
  border-radius: 8px;
  padding: 0 12px;
  padding-right: 3.5rem;
  margin: 0 8px;
  border: 2px solid ${props => props.borderColor};
  box-shadow: -5px 5px 4px #e2e2e2, 5px -5px 4px rgb(255 255 255);
  position: relative;
  overflow: hidden;
`;

const ColumnHeaderWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 0 12px 12px;
`;

const ColumnHeader = styled.h2<{ titleColor: string, bgColor: string }>`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.titleColor};
  margin: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${props => props.bgColor};
  display: inline-block;
  padding-right: 32px; // Espacio para la burbuja
`;

const CountBadge = styled.span<{ bgColor: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${props => props.bgColor};
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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
  onFilterChange, 
  titleColor,
  borderColor,
  bgColor,
  lightBgColor,
  totalHours = 0,
  onLoadMore,
  hasMoreItems,
  isLoading
}: KanbanColumnProps & {
  onLoadMore: () => void;
  hasMoreItems: boolean;
  isLoading: boolean;
}) => {
  const sentinelRef = useInfiniteScroll(onLoadMore, isLoading, hasMoreItems);

  return (
    <ColumnContainer 
      aria-label={`Columna ${title}`}
      bgColor={bgColor}
      borderColor={borderColor}
      lightBgColor={lightBgColor}
    >
      <ColumnHeaderWrapper>
        <ColumnHeader titleColor={titleColor} bgColor={bgColor}>
          {title} • <HoursBadge titleColor={titleColor}>{totalHours}<AccessTime fontSize="small"/></HoursBadge> 
        </ColumnHeader>
      </ColumnHeaderWrapper>
      <ColumnContent borderColor={borderColor} lightBgColor={lightBgColor} >
        <CountBadge bgColor={borderColor}>
            {issues.length}
          </CountBadge>
        <IssuesList>
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} updateAssigneeFilter={onFilterChange}/>
          ))}
        {isLoading && (
            <>
              <IssueSkeleton />
              <IssueSkeleton />
              <IssueSkeleton />
            </>
        )}
        {hasMoreItems && (
            <div ref={sentinelRef} style={{ height: '1px' }} />
          )}
        </IssuesList>
      </ColumnContent>
    </ColumnContainer>
  );
};