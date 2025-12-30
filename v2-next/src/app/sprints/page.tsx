'use client';

import CardProjects from "@/components/cardsProjects";
import { FilterProjects } from "@/components/Filter/FilterProjects";
import { FilterUptimer } from "@/components/Filter/FilterUptimer";
import { KanbanColumnSprint } from "@/components/Kanban/KanbanColumnSprint";
import { useJira } from "@/hook/useJira";
import { useUptimeRobot } from "@/hook/useUptimeRobot";
import { useState } from "react";

export default function DashboardPage() {
  const { projects } = useJira({ viewIssuesProjects: true });
  const { monitoring } = useUptimeRobot({ viewMonitoring: true })
  const [selectedProject, setSelectedProject] = useState<string>("all");

  console.log(monitoring)

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-semibold w-full">Sprints</h1>

      <div className="bg-background p-2 rounded-lg h-full flex flex-col w-full">
        <div className="w-full flex justify-between items-center text-sm opacity-70">
          last 24 hours
          <FilterUptimer />
        </div>

        <div className="overflow-y-scroll sm:overflow-auto h-64 p-2 sm:h-full w-full flex flex-col sm:flex-row gap-4">
          {Array.isArray(projects) &&
            projects.map((project) => {
              const projectMonitors =
                project.name === "DG.Alivia Colombia" && Array.isArray(monitoring)
                  ? monitoring.reduce(
                    (acc, m) => {
                      const name = m.name.toLowerCase()

                      if (name.includes("dev") || name.includes("develop")) {
                        acc.dev = m
                      } else {
                        acc.qa = m
                      }

                      return acc
                    },
                    {} as {
                      dev?: typeof monitoring[number]
                      qa?: typeof monitoring[number]
                    }
                  )
                  : {}

              return (
                <CardProjects
                  key={project.id}
                  name={project.name}
                  avatarUrls={project.avatarUrls?.["48x48"] || ""}
                  projectTypeKey={project.projectTypeKey}
                  simplified={project.simplified}
                  isSelected={project.id === selectedProject}
                  onClick={() => setSelectedProject(project.id)}
                  monitors={projectMonitors}
                />
              )
            })}

        </div>
      </div>

      <div className="bg-background w-full p-2 sm:p-6 rounded-lg overflow-auto">
        <div className="border-b mb-3 flex justify-between items-center text-sm opacity-70">
          Proyectos
          <FilterProjects
            projects={projects}
            value={selectedProject}
            onChange={setSelectedProject}
          />
        </div>
        <KanbanColumnSprint projectId={selectedProject} />
      </div>
    </div>
  );
}
