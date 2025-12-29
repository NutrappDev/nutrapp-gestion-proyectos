'use client';

import CardProjects from "@/components/cardsProjects";
import { FilterUptimer } from "@/components/Filter/FilterUptimer";
import { KanbanColumnSprint } from "@/components/Kanban/KanbanColumnSprint";
import { useJira } from "@/hook/useJira";


export default function DashboardPage() {
const { projects } = useJira({viewIssuesProjects:true});

  const filter = {
    projects: 'all'
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-semibold w-full">Dashboard</h1>
      <div className="bg-background p-2 rounded-lg h-full flex flex-col w-full">
        <div className="w-full flex justify-between items-center">
          last 24 hours
          <FilterUptimer />
        </div>
        <div className="overflow-y-scroll overflow-x-hidden sm:overflow-auto h-64 w-full flex flex-wrap sm:flex-nowrap gap-6 sm:gap-4">
          {Array.isArray(projects) && projects.map((project: any) => (
            <div key={project.id}>
              <CardProjects
                name={project.name}
                avatarUrls={project.avatarUrls['48x48'] || ''}
                projectTypeKey={project.projectTypeKey}
                simplified={project.simplified}
                isSelected={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-background w-full p-2 sm:p-6  rounded-lg overflow-auto sm:overflow-hidden">
        <KanbanColumnSprint filters={filter}/>
      </div>
    </div>
  );
}
