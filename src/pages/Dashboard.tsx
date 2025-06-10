import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from '@mui/material/CircularProgress';
import { useIssues } from '../hooks/useIssues';
import { KanbanColumn } from '../components/KanbanColumn/KanbanColumn';
import { Filters } from '../components/Filters/Filters';
import { useUsers } from '../hooks/useUsers';
import { useProjects } from '../hooks/useProjects';
import type { JiraIssue } from '../types/jira';

const DashboardContainer = styled.div`
  padding: 20px;
  min-width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
  flex: 1;
  overflow: 'auto';
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #5e6c84;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #ff5630;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dashboard = () => {
  const { 
    issues,
    loading, 
    error, 
    filters,
    updateFilter,
    resetFilters,
    pagination,
    goToPage
  } = useIssues();
  const [page, setPage] = useState(1);
  const { users, loading: usersLoading } = useUsers();
  const { projects, loading: projectLoading } = useProjects();

  
  const allProjects = useMemo(() => {
    if (projectLoading) return [];
    const projectNames = projects.map(project => project.name);
    return [...projectNames].sort((a, b) => a.localeCompare(b));
  }, [projects, projectLoading]);

  const assignees = useMemo(() => {
    if (usersLoading) return [];
    const userNames = users.map(user => user.name);
    return ['Equipo-Desarrollo', ...userNames].sort((a, b) => a.localeCompare(b));
  }, [users, usersLoading]);

  const sortByDueDate = (a: JiraIssue, b: JiraIssue) => {
    if (!a.duedate) return 1;
    if (!b.duedate) return -1;
    return new Date(a.duedate).getTime() - new Date(b.duedate).getTime();
  };


  const todoIssues = useMemo(() => 
    issues.filter(i => i.statusCategory === 'Por hacer').sort(sortByDueDate), 
    [issues]
  );

  const inProgressIssues = useMemo(() =>
    issues.filter(i =>
        i.statusCategory === 'En curso' && i.status !== 'Esperando aprobación'
    ).sort(sortByDueDate),
    [issues]
  );

  const doneIssues = useMemo(() =>
    issues.filter(i =>
      i.statusCategory === 'En curso' && i.status === 'Esperando aprobación'
    ).sort(sortByDueDate),
    [issues]
  );

  const totalTodoHours = useMemo(() => 
    todoIssues.reduce((sum, issue) => sum + (Number(issue.storyPoints) || 0), 0), 
    [todoIssues]
  );

  const totalInProgressHours = useMemo(() => 
    inProgressIssues.reduce((sum, issue) => sum + (Number(issue.storyPoints) || 0), 0), 
    [inProgressIssues]
  );

  const totalDoneHours = useMemo(() => 
    doneIssues.reduce((sum, issue) => sum + (Number(issue.storyPoints) || 0), 0), 
    [doneIssues]
  );

  const loadMoreIssues = () => {
    if (!pagination.isLast && !loading) {
      goToPage(pagination.page+1);
    }
  };
  
  if (error) return (
    <>
      <ErrorMessage>Error: {error}</ErrorMessage>
    </>
  );

  return (
    <>
      <DashboardContainer >
        <h1 className="pt-4 pb-8 bg-gradient-to-r from-[#4E3762] via-[#534379] to-[#BBACD1] bg-clip-text text-center text-4xl font-normal tracking-tight text-transparent md:text-7xl"
        style={{ fontWeight: 500 }}>
          TeamBoard
        </h1>
        <Filters
          projects={allProjects}
          assignees={assignees}
          currentFilters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />


       <ColumnsContainer>
          <KanbanColumn 
            title="Backlog" 
            issues={todoIssues} 
            onFilterChange={updateFilter}
            totalHours={totalTodoHours}
            titleColor="#373448"
            borderColor="#857C99"
            bgColor="#D5D4DF"
            lightBgColor="#F6F6FA"
            onLoadMore={loadMoreIssues}
            hasMoreItems={!pagination.isLast}
            isLoading={loading}
          />
          <KanbanColumn 
            title="En progreso" 
            issues={inProgressIssues} 
            onFilterChange={updateFilter}
            totalHours={totalInProgressHours}
            titleColor="#362D4C"
            borderColor="#f6b46b"
            bgColor="#FFE9D1"
            lightBgColor="#F6F6FA"
            onLoadMore={loadMoreIssues}
            hasMoreItems={!pagination.isLast}
            isLoading={loading}
          />
          <KanbanColumn 
            title="Esperando Aprobacion" 
            issues={doneIssues} 
            onFilterChange={updateFilter}
            totalHours={totalDoneHours}
            titleColor="#362D4C"
            borderColor="#65D9A9"
            bgColor="#C7EFE2"
            lightBgColor="#F6F6FA"
            onLoadMore={loadMoreIssues}
            hasMoreItems={!pagination.isLast}
            isLoading={loading}
          />
        </ColumnsContainer>

      </DashboardContainer>
    </>
  );
};