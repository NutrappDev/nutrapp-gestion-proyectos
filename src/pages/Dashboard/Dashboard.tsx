import { useMemo } from 'react';
import { Tabs, rem } from '@mantine/core';
import { IconTimeline, IconLayoutKanban } from '@tabler/icons-react';
import { useProjects } from '@hooks/useProjects';
import { Filters } from '@components/Filters/Filters';
import { ALL_ASSIGNEES } from '@constants/team';
import { useFiltersContext } from '@/context/FiltersContext';
import D3GanttChart from '@components/GanttChart/d3Gantt';
import { KanbanView } from '@/components/KanbanColumn/KanbanView';
import { UserIssuesSummary } from '@/components/UserSummary/UserIssuesSummary';
import classes from './Dashboard.module.scss'; 

export const Dashboard = () => {
  const { projects, loading: projectLoading } = useProjects();
  const { getSelectedTeamName } = useFiltersContext();

  const allProjects = useMemo(() => {
    if (projectLoading) return [];
    const projectNames = projects.map(project => project.name);
    return [...projectNames].sort((a, b) => a.localeCompare(b));
  }, [projects, projectLoading]);

  const dashboardTitle = useMemo(() => {
    const selectedTeamName = getSelectedTeamName();
    return selectedTeamName ? selectedTeamName : 'NUTRAPP';
  }, [getSelectedTeamName]);

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.animatedContent} key={dashboardTitle}>
        <div className="flex items-center justify-center px-4 py-4 my-12">
          <h1 className={classes.animatedTitle}>{dashboardTitle}</h1>
        </div>
      </div>
      <UserIssuesSummary />
      
      <Tabs
        defaultValue={"Kanban"}
        aria-label="board tabs"
        classNames={{
          root: classes.tabsRoot,
          list: classes.tabsList,
          tab: classes.tab,
          panel: classes.tabPanel
        }}
      >
        <Tabs.List style={{padding:'0 1.5rem'}}>
          <Tabs.Tab
            value="Kanban"
            leftSection={<IconLayoutKanban style={{ width: rem(18), height: rem(18) }} />}
          >
            List View
          </Tabs.Tab>
          <Tabs.Tab
            value="Timeline"
            leftSection={<IconTimeline style={{ width: rem(18), height: rem(18) }} />}
          >
            Timeline
          </Tabs.Tab>
          <Filters projects={allProjects} assignees={ALL_ASSIGNEES} />
        </Tabs.List>
        <Tabs.Panel value={'Kanban'} >
          <KanbanView />
        </Tabs.Panel>
        <Tabs.Panel value={'Timeline'} >
          <D3GanttChart />
        </Tabs.Panel>
      </Tabs>

    </div>
  );
};