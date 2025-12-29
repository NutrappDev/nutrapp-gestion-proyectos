import { useJira } from "@/hook/useJira"
import { JiraProject } from "@/types/jira"
import { useEffect, useMemo, useState } from "react"

interface KanbanColumnProps {
  filters: {
    projects: string
  }
}

const COLOR_PALETTE = [
  {
    bg: "bg-slate-200 dark:bg-slate-700",
    light: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-600",
  },
  {
    bg: "bg-slate-200 dark:bg-slate-600",
    light: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-600",
  },
  {
    bg: "bg-gray-200 dark:bg-gray-700",
    light: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-200",
    border: "border-gray-200 dark:border-gray-600",
  },
  {
    bg: "bg-zinc-200 dark:bg-zinc-700",
    light: "bg-zinc-50 dark:bg-zinc-800",
    text: "text-zinc-700 dark:text-zinc-200",
    border: "border-zinc-200 dark:border-zinc-600",
  },
  {
    bg: "bg-neutral-200 dark:bg-neutral-700",
    light: "bg-neutral-50 dark:bg-neutral-800",
    text: "text-neutral-700 dark:text-neutral-200",
    border: "border-neutral-200 dark:border-neutral-600",
  },
]

export const KanbanColumnSprint = ({ filters }: KanbanColumnProps) => {
  const {
    projects,
    issues,
    isLoading,
    isLoadingIssues,
    error,
    getIssuesByProject,
    getProgresProject
  } = useJira({
    viewIssuesProjects: true,
  })

  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const [projectProgress, setProjectProgress] = useState<
    Record<string, { total: number; done: number; progress: number }>
  >({})


  const sortedProjects = useMemo(() => {
    if (!Array.isArray(projects)) return []
    return [...projects].sort((a, b) => a.name.localeCompare(b.name))
  }, [projects])

  useEffect(() => {
    if (!projects.length) return

    const loadProgress = async () => {
      const results = await Promise.all(
        projects.map(async (project) => {
          const progress = await getProgresProject(project)
          return [project.id, progress] as const
        })
      )

      setProjectProgress(Object.fromEntries(results))
    }

    loadProgress()
  }, [projects])


  const toggleProject = async (project: JiraProject) => {
    if (openProjectId === project.id) {
      setOpenProjectId(null)
      return
    }

    await getIssuesByProject(project)
    setOpenProjectId(project.id)
  }

  if (isLoading) {
    return (
      <div className="h-full bg-surface rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-surface rounded-lg p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded flex flex-wrap gap-2">
      {sortedProjects.map((project, index) => {
        const colors = COLOR_PALETTE[index % COLOR_PALETTE.length]
        const isOpen = openProjectId === project.id

        return (
          <div
            key={project.id}
            className={`p-3 w-full flex flex-wrap rounded min-w-0 ${colors.bg} ${colors.border}`}
          >
            <div className="w-full flex items-center min-w-0">
              <div className="flex flex-col p-4 justify-center min-w-0 flex-[0_0_80%]">
                <p className="font-medium truncate whitespace-nowrap min-w-0">
                  {project.key} - {project.name}
                </p>
                <div className="mt-2 w-full bg-white/40 rounded h-2 overflow-hidden">
                  <div
                    className="h-2 bg-emerald-500 transition-all"
                    style={{
                      width: `${projectProgress[project.id]?.progress ?? 0}%`,
                    }}
                  />
                </div>

                <p className="text-xs mt-1 opacity-80">
                  {projectProgress[project.id]?.progress ?? 0}% completado
                </p>
              </div>
              <div className="p-2 flex justify-center items-center w-full">
                <button
                  onClick={() => toggleProject(project)}
                  className={`flex flex-col sm:flex-row items-center justify-center rounded px-2 py-1 text-center
                  ${colors.light} ${colors.text}`}
                >
                  <span className="text-xs sm:hidden leading-tight">
                    Ver
                  </span>
                  <span className="text-xs sm:hidden leading-tight">
                    issues
                  </span>

                  <span className="text-xs hidden sm:inline whitespace-nowrap">
                    {isOpen ? "Cerrar" : "Ver issues"}
                  </span>
                </button>
              </div>
            </div>

            {isOpen && (
              <div
                className={`border-t ${colors.border} px-3 py-2 space-y-2 max-h-64 overflow-y-auto w-full`}
              >
                {isLoadingIssues && (
                  <p className="text-xs text-muted-foreground">
                    Cargando issues...
                  </p>
                )}

                {!isLoadingIssues && issues.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No issues
                  </p>
                )}

                {!isLoadingIssues &&
                  issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-2 rounded bg-background text-sm min-w-0"
                    >
                      <p className="truncate">{issue.fields.summary}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
