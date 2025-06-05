import { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { useIssues } from '../hooks/useIssues';
import { KanbanColumn } from '../components/KanbanColumn/KanbanColumn';
import { Header } from '../components/Layout/Header';
import { Filters } from '../components/Filters/Filters';
import { PaginationControls } from '../components/PaginationControls';

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
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
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
    refresh,
    filters,
    pagination,
    updateFilter,
    resetFilters,
    goToPage,
  } = useIssues();


  useEffect(() => {
    console.log('Issues:', issues);
    console.log('All Issues:', issues);
    console.log('Filters:', filters);
  }, [issues, issues, filters]);
  
  const projects = useMemo(() => {
    const projectSet = new Set<string>();
    issues.forEach(issue => {
      if (typeof issue.project === 'string' && issue.project.trim() !== '') {
        projectSet.add(issue.project);
      }
    });
    return Array.from(projectSet).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  const assignees = useMemo(() => {
    const userSet = new Set<string>();
    issues.forEach(issue => {
      if (typeof issue.assignee?.name === 'string' && issue.assignee?.name.trim() !== '') {
        userSet.add(issue.assignee?.name);
      }
    });
    return Array.from(userSet).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  const todoIssues = useMemo(() => 
    issues.filter(i => i.statusCategory === 'Por hacer'), 
    [issues]
  );
  
  const inProgressIssues = useMemo(() => 
    issues.filter(i => i.statusCategory === 'En curso'), 
    [issues]
  );
  
  const doneIssues = useMemo(() => 
    issues.filter(i => i.statusCategory === 'Listo'), 
    [issues]
  );
  
  if (error) return (
    <>
      <Header title="JiraScope Dashboard" onRefresh={refresh} />
      <ErrorMessage>Error: {error}</ErrorMessage>
    </>
  );

  return (
    <>
      <DashboardContainer>
        <Header title="JiraScope Dashboard" onRefresh={refresh} />
        <Filters
          projects={projects}
          assignees={assignees}
          currentFilters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        <PaginationControls
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          totalItems={pagination.total}
          isLast={pagination.isLast}
          onPageChange={goToPage}
        />

        {loading ?(
          <LoadingMessage>Cargando incidencias...</LoadingMessage>
        ):(
          <ColumnsContainer>
          <KanbanColumn 
            title="Backlog" 
            issues={todoIssues} 
            onFilterChange={updateFilter}
            titleColor="#000000"
            borderColor="#aaa9a9"
            bgColor="#c9c9c9"
            lightBgColor="#f0f7ff"
          />
          <KanbanColumn 
            title="En progreso" 
            issues={inProgressIssues} 
            onFilterChange={updateFilter}
            titleColor="#000000"
            borderColor="#f6c16b"
            bgColor="#f3e3c1"
            lightBgColor="#fdf4e6"
          />
          <KanbanColumn 
            title="Esperando Aprobacion" 
            issues={doneIssues} 
            onFilterChange={updateFilter}
            titleColor="#000000"
            borderColor="#69e5ab"
            bgColor="#c1eece"
            lightBgColor="#dff9e8"
          />
        </ColumnsContainer>
        )}
      </DashboardContainer>
    </>
  );
};