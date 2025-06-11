import { useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { useIssues } from '../hooks/useIssues';
import { KanbanColumn } from '../components/KanbanColumn/KanbanColumn';
import { Filters } from '../components/Filters/Filters';
import { useProjects } from '../hooks/useProjects';
import type { JiraIssue } from '../types/jira';
import { TEAM_DEVELOPMENT } from '../constants/team';
import GanttTimeline from '../components/Timeline/GanttTimeline';

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
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  const { projects, loading: projectLoading } = useProjects();
  useEffect(()=>{
    console.log("paginacion",pagination)
  },[issues])
  
  const allProjects = useMemo(() => {
    if (projectLoading) return [];
    const projectNames = projects.map(project => project.name);
    return [...projectNames].sort((a, b) => a.localeCompare(b));
  }, [projects, projectLoading]);

  const assignees = TEAM_DEVELOPMENT.sort((a, b) => a.localeCompare(b));

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
        i.statusCategory === 'En curso' && i.status!== 'Esperando aprobación' && i.status!== 'Detenido'
    ).sort(sortByDueDate),
    [issues]
  );

  const doneIssues = useMemo(() =>
    issues.filter(i =>
      i.statusCategory === 'En curso' && i.status === 'Esperando aprobación'
    ).sort(sortByDueDate),
    [issues]
  );

  const cancelIssues = useMemo(() =>
    issues.filter(i => i.status === 'Detenido'
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
  const totalCancelHours = useMemo(() => 
    cancelIssues.reduce((sum, issue) => sum + (Number(issue.storyPoints) || 0), 0), 
    [cancelIssues]
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
          <KanbanColumn 
            title="Detenido" 
            issues={cancelIssues} 
            onFilterChange={updateFilter}
            totalHours={totalCancelHours}
            titleColor="#362D4C"
            borderColor="#ef496f"
            bgColor="#f1c5c7"
            lightBgColor="#F6F6FA"
            onLoadMore={loadMoreIssues}
            hasMoreItems={!pagination.isLast}
            isLoading={loading}
          />
        </ColumnsContainer>

        <GanttTimeline issues={inProgressIssues} assignees={assignees} />

      </DashboardContainer>
    </>
  );
};