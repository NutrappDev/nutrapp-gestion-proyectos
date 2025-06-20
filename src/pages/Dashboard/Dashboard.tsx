import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { Timeline, ViewKanban } from '@mui/icons-material';
import { useProjects } from '@hooks/useProjects';
import { useDashboardTabs } from '@hooks/useDashboardTabs';
import { Filters } from '@components/Filters/Filters';
import { TabPanel, a11yProps } from '@components/UI/TabPanel';
import { TEAM_DEVELOPMENT_MEMBERS, TEAM_OPERATIONS_MEMBERS } from '@constants/team';
import { useFiltersContext } from '@/context/FiltersContext';
import D3GanttChart from '@components/GanttChart/d3Gantt';
import {
  DashboardContainer,
  AnimatedTitle,
  CustomTabs,
  CustomTab,
  AnimatedContent
} from './Dashboard.styles';

import { KanbanView } from '@/components/KanbanColumn/KanbanView';
import { UserIssuesSummary } from '@/components/UserSummary/UserIssuesSummary';

export const Dashboard = () => {
  const { projects, loading: projectLoading } = useProjects();
  const { activeTab, handleTabChange } = useDashboardTabs();
  const { getSelectedTeamName } = useFiltersContext();

  const allProjects = useMemo(() => {
    if (projectLoading) return [];
    const projectNames = projects.map(project => project.name);
    return [...projectNames].sort((a, b) => a.localeCompare(b));
  }, [projects, projectLoading]);

  const assignees = [...TEAM_DEVELOPMENT_MEMBERS,...TEAM_OPERATIONS_MEMBERS].sort((a, b) => a.localeCompare(b));

  const dashboardTitle = useMemo(() => {
    const selectedTeamName = getSelectedTeamName();
    return selectedTeamName ? selectedTeamName: 'NUTRAPP';
  }, [ getSelectedTeamName]);

  return (
    <DashboardContainer>
      <AnimatedContent key={dashboardTitle}>
        <div className="flex items-center justify-center px-4 py-4 my-12">
          <AnimatedTitle>
            {dashboardTitle}
          </AnimatedTitle>
        </div>
      </AnimatedContent>
      <UserIssuesSummary />

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxShadow: '1px 2px 3px #DADADA',
      }}>
        <CustomTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="board tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#3c2052',
            },
          }}
          sx={{
            color: '#3c2052'
          }}
        >
          <CustomTab icon={<ViewKanban fontSize="small" />} iconPosition="start" label="List View" {...a11yProps(0)} />
          <CustomTab icon={<Timeline fontSize="small" />} iconPosition="start" label="Timeline" {...a11yProps(1)} />
        </CustomTabs>
        <Filters
          projects={allProjects}
          assignees={assignees}
        />
      </Box>

      <TabPanel value={activeTab} index={0}>
        <KanbanView />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <D3GanttChart />
      </TabPanel>
    </DashboardContainer>
  );
};