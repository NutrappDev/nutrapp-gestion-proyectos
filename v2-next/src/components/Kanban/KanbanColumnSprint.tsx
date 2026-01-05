import { useJira } from "@/hook/useJira"
import { JiraProject } from "@/types/jira"
import { getEpicProgressByDoneIssues, getIssueProgressByComments } from "@/utils/jira"
import { useEffect, useMemo, useState } from "react"

interface KanbanColumnProps {
  projectId: string
}

const COLOR_PALETTE = [
  {
    bg: "bg-slate-200 dark:bg-slate-700",
    acent: "bg-slate-300 dark:bg-slate-800",
    hover: "hover:bg-slate-400 dark:hover:bg-slate-900",
    light: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-600",
  },
  {
    bg: "bg-slate-200 dark:bg-slate-600",
    acent: "bg-slate-300 dark:bg-slate-700",
    hover: "hover:bg-slate-400 dark:hover:bg-slate-800",
    light: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-600",
  },
  {
    bg: "bg-gray-200 dark:bg-gray-700",
    acent: "bg-gray-300 dark:bg-gray-800",
    hover: "hover:bg-gray-400 dark:hover:bg-gray-900",
    light: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-200",
    border: "border-gray-200 dark:border-gray-600",
  },
  {
    bg: "bg-zinc-200 dark:bg-zinc-700",
    acent: "bg-zinc-300 dark:bg-zinc-800",
    hover: "hover:bg-zinc-400 dark:hover:bg-zinc-900",
    light: "bg-zinc-50 dark:bg-zinc-800",
    text: "text-zinc-700 dark:text-zinc-200",
    border: "border-zinc-200 dark:border-zinc-600",
  },
  {
    bg: "bg-neutral-200 dark:bg-neutral-700",
    acent: "bg-neutral-300 dark:bg-neutral-800",
    hover: "hover:bg-neutral-400 dark:hover:bg-neutral-900",
    light: "bg-neutral-50 dark:bg-neutral-800",
    text: "text-neutral-700 dark:text-neutral-200",
    border: "border-neutral-200 dark:border-neutral-600",
  },
]


export const KanbanColumnSprint = ({ projectId }: KanbanColumnProps) => {
  const {
    projects,
    issues,
    isLoading,
    isLoadingIssues,
    error,
    getIssuesByProject,
    getProgresProject
  } = useJira({
    viewProjects: true,
  })

  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const [projectProgress, setProjectProgress] = useState<
    Record<string, { total: number; done: number; progress: number }>
  >({})
  const [openEpics, setOpenEpics] = useState<Record<string, boolean>>({});

  const sortedProjects = useMemo(() => {
    if (!Array.isArray(projects)) return []

    const filtered =
      projectId === "all"
        ? projects
        : projects.filter((p) => p.id === projectId)

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }, [projects, projectId])


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

  const { epics, issuesWithEpic, issuesWithoutEpic } = useMemo(() => {
    const epics = issues.filter(
      (i) => i.fields.issuetype.name === "Epic"
    )

    const issuesWithEpic = issues.filter(
      (i) =>
        i.fields.issuetype.name !== "Epic" &&
        i.fields.parent
    )

    const issuesWithoutEpic = issues.filter(
      (i) =>
        i.fields.issuetype.name !== "Epic" &&
        !i.fields.parent
    )

    return { epics, issuesWithEpic, issuesWithoutEpic }
  }, [issues])


  const toggleProject = async (project: JiraProject) => {
    if (openProjectId === project.id) {
      setOpenProjectId(null)
      return
    }

    await getIssuesByProject(project)
    setOpenProjectId(project.id)
  }

  const toggleEpic = (id: string) => {
    setOpenEpics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


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
                  className={`flex flex-col cursor-pointer sm:flex-row items-center justify-center rounded px-2 py-1 text-center
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

                {!isLoadingIssues && (
                  <div className="space-y-3">

                    {epics.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold opacity-70">Épicas</p>

                        {epics.map((epic) => {
                          const epicIssues = issuesWithEpic.filter(
                            (i) => i.fields.parent?.id === epic.id
                          )

                          const doneCount = epicIssues.filter(
                            (i) => i.fields.status?.statusCategory?.key === "done"
                          ).length

                          const epicProgress = epicIssues.length
                            ? Math.round((doneCount / epicIssues.length) * 100)
                            : 0

                          return (
                            <div
                              key={epic.id}
                              className={`p-2 rounded transition-colors ${colors.acent} ${colors.hover}`}
                              onClick={() => toggleEpic(epic.id)}
                            >

                              <div className="px-2 pb-2  cursor-pointer">
                                <div className="px-2 py-1 text-sm font-medium">
                                  {epic.fields.summary}
                                </div>
                                <span className="text-[10px] opacity-70">
                                  Progreso épica ({doneCount}/{epicIssues.length} DONE)
                                </span>

                                <div className="bg-white/60 w-full h-2 rounded overflow-hidden">
                                  <div
                                    className={`h-2 transition-all ${epicProgress < 50
                                      ? "bg-red-400"
                                      : epicProgress < 80
                                        ? "bg-yellow-400"
                                        : "bg-emerald-500"
                                      }`}
                                    style={{ width: `${epicProgress}%` }}
                                  />
                                </div>

                                <span className="text-[10px] opacity-60">
                                  {epicProgress}% completado
                                </span>
                              </div>

                              {openEpics[epic.id] && (
                                <div className="pl-4 py-2 space-y-1">
                                  {epicIssues.map((issue) => {
                                    const progress = getIssueProgressByComments(issue)

                                    return (
                                      <div
                                        key={issue.id}
                                        className="text-xs p-1 rounded bg-surface flex gap-2 w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="p-2">
                                          <img
                                            src={issue.fields.issuetype.iconUrl}
                                            alt="issue icon"
                                          />
                                        </div>

                                        <div className="p-2 w-4/5">
                                          <h3 className="font-bold">{issue.key}</h3>
                                          <p>{issue.fields.summary}</p>

                                          <div className="w-full mt-1">
                                            <span className="text-[10px] opacity-70">
                                              Progreso ({progress.currentComments} comentarios de {progress.expectedComments})
                                            </span>

                                            <div className="bg-gray-200 dark:bg-white/60 w-full h-2 rounded overflow-hidden">
                                              <div
                                                className="bg-emerald-500 h-2 transition-all"
                                                style={{ width: `${progress.progress}%` }}
                                              />
                                            </div>

                                            <span className="text-[10px] opacity-60">
                                              {progress.progress}% esperado
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}

                                  {epicIssues.length === 0 && (
                                    <p className="text-xs opacity-60">Sin issues</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}

                      </div>
                    )}

                    {issuesWithoutEpic.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold opacity-70">
                          Issues sin épica
                        </p>

                        {issuesWithoutEpic.map((issue) => {
                          const progress = getIssueProgressByComments(issue)

                          return (
                            <div
                              key={issue.id}
                              className="text-xs p-1 rounded bg-surface flex gap-2 w-full"
                            >
                              <div className="p-2">
                                <img src={`${issue.fields.issuetype.iconUrl}`} alt="issues icon" />
                              </div>
                              <div className="p-2 w-4/5">
                                <div className="truncate">
                                  <h3 className="font-bold">
                                    {issue.key}
                                  </h3>
                                  <p>
                                    {issue.fields.summary}
                                  </p>
                                </div>

                                <div className="w-full">
                                  <span className="text-[10px] opacity-70">
                                    Progreso ({progress.currentComments} comentarios de {progress.expectedComments}) 
                                  </span>
                                  <div className="bg-gray-200 dark:bg-white/60 w-full h-2 rounded overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-2 transition-all"
                                      style={{ width: `${progress.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] opacity-60">
                                    {progress.progress}% esperado
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {epics.length === 0 && issuesWithoutEpic.length === 0 && (
                      <div className="space-y-2">
                        {issues.map((issue) => {
                          const progress = getIssueProgressByComments(issue)

                          return (
                            <div
                              key={issue.id}
                              className="text-xs p-1 rounded bg-surface flex w-full"
                            >
                              <div className="p-2">
                                <img src={`${issue.fields.issuetype.iconUrl}`} alt="issues icon" />
                              </div>
                              <div className="p-2 w-4/5">
                                <div className="truncate">
                                  <h3 className="font-bold">
                                    {issue.key}
                                  </h3>
                                  <p>
                                    {issue.fields.summary}
                                  </p>
                                </div>

                                <div className="w-full">
                                  <span className="text-[10px] opacity-70">
                                    Progreso ({progress.currentComments} comentarios de {progress.expectedComments}) 
                                  </span>
                                  <div className="bg-gray-200 dark:bg-white/60 w-full h-2 rounded overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-2 transition-all"
                                      style={{ width: `${progress.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] opacity-60">
                                    {progress.progress}% esperado
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
