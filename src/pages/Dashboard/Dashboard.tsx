import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { Timeline, ViewKanban } from '@mui/icons-material';
import { useFiltersContext } from '@/context/FiltersContext'; 
import { useProjects } from '@hooks/useProjects';
import { useDashboardTabs } from '@hooks/useDashboardTabs';
import { Filters } from '@components/Filters/Filters';
import { TabPanel, a11yProps } from '@components/UI/TabPanel';
import { TEAM_DEVELOPMENT } from '@constants/team';
import logo from '@assets/imgs/teamdev.png';
import D3GanttChart from '@components/GanttChart/d3Gantt';
import {
  DashboardContainer,
  ImageContainer,
  CustomTabs,
  CustomTab,
} from './Dashboard.styles';

import { KanbanView } from '@/components/KanbanColumn/KanbanView';

export const Dashboard = () => {
  const { filters, updateFilter, resetFilters, pageSize, setPageSize } = useFiltersContext();
  const { projects, loading: projectLoading } = useProjects();
  const { activeTab, handleTabChange } = useDashboardTabs();

  const allProjects = useMemo(() => {
    if (projectLoading) return [];
    const projectNames = projects.map(project => project.name);
    return [...projectNames].sort((a, b) => a.localeCompare(b));
  }, [projects, projectLoading]);

  const assignees = TEAM_DEVELOPMENT.sort((a, b) => a.localeCompare(b));

  return (
    <DashboardContainer>
      <div className="flex items-center justify-center px-4 py-2">
        <ImageContainer>
          <img
            src={logo}
            alt="Logo TeamBoard"
            className="w-full h-full object-contain"
          />
        </ImageContainer>
      </div>

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
          currentFilters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
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