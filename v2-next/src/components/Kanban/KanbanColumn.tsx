import { useJira } from "@/hook/useJira"
import { IconClipboardText } from "@tabler/icons-react"
import { IssuesCard } from "../Issues/IssuesCards"
import { JiraIssue } from "@/types/jira"
import { useMemo } from "react"
import { findTeamByAssignee } from "@/types/team"

interface ColumnData {
  status: JiraIssue[]
  total: number
  points: number
}

interface GroupedIssues {
  [key: string]: ColumnData
}

interface KanbanColumnProps {
  filters: {
    teamId: string
    assigned: string
    status: string
  }
}

const normalizeName = (name: string): string =>
  name.trim().toLowerCase()

const getAssigneeName = (issue: JiraIssue): string | null =>
  issue.fields?.assignee?.displayName
    ? normalizeName(issue.fields.assignee.displayName)
    : null

const getStatusName = (issue: JiraIssue): string =>
  issue.fields?.status?.name ?? ""

const getStatusCategory = (issue: JiraIssue): string =>
  issue.fields?.status?.statusCategory?.name ?? ""

const getStoryPoints = (issue: JiraIssue): number =>
  Number(issue.fields?.customfield_10016) || 0

export const KanbanColumn = ({ filters }: KanbanColumnProps) => {
  const { issuesByUser, isLoading, error } = useJira({ viewIssuesUsers: true })

  const rawIssues: JiraIssue[] = Array.isArray(issuesByUser)
    ? issuesByUser
    : []

  const columns = [
    { status: "Backlog", bgColor: "bg-blue-600", textColor: "text-white" },
    { status: "Por hacer", bgColor: "bg-blue-500", textColor: "text-white" },
    { status: "En proceso", bgColor: "bg-yellow-500", textColor: "text-black" },
    { status: "Revisión QA", bgColor: "bg-yellow-600", textColor: "text-white" },
    { status: "Esperando aprobación", bgColor: "bg-green-600", textColor: "text-white" },
    { status: "Detenido", bgColor: "bg-red-600", textColor: "text-white" },
  ]

  const filteredIssues = useMemo(() => {
    return rawIssues.filter((issue) => {
      const assigneeName = getAssigneeName(issue)

      // Filtro por asignado
      if (filters.assigned !== "all") {
        if (filters.assigned === "assigned" && !assigneeName) return false
        if (filters.assigned === "unassigned" && assigneeName) return false
      }

      // Filtro por equipo
      if (filters.teamId !== "all") {
        if (!assigneeName) return false
        const team = findTeamByAssignee(assigneeName)
        if (!team || team.id !== filters.teamId) return false
      }

      // Filtro por status
      if (filters.status && filters.status !== "all") {
        const issueStatusName = issue.fields.status.name
        if (filters.status === "pending" && !["Backlog", "Por hacer"].includes(issueStatusName)) return false
        if (filters.status === "in-progress" && !["En proceso", "Revisión QA", "Esperando aprobación", "Detenido"].includes(issueStatusName)) return false
        if (filters.status === "done" && issue.fields.status.statusCategory.key !== "done") return false
      }

      return true
    })
  }, [rawIssues, filters.assigned, filters.teamId, filters.status])

  const groupedIssues: GroupedIssues = useMemo(() => {
    const grouped: GroupedIssues = columns.reduce((acc, column) => {
      acc[column.status] = { status: [], total: 0, points: 0 }
      return acc
    }, {} as GroupedIssues)

    filteredIssues.forEach((issue) => {
      const issueStatusName = issue.fields.status.name
      const column = columns.find(col => col.status === issueStatusName)
      if (column) {
        grouped[column.status].status.push(issue)
        grouped[column.status].points += getStoryPoints(issue)
        grouped[column.status].total += 1
      }
    })

    return grouped
  }, [filteredIssues, columns])

  if (isLoading) {
    return (
      <div className="h-full bg-surface rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
    <div className="h-[70vh] bg-surface rounded-lg shadow border border-border overflow-hidden">
      <div className="h-full overflow-x-auto overflow-y-hidden p-4">
        <div className="h-full flex gap-4">
          {columns.map((column) => {
            const columnData = groupedIssues[column.status]
            const columnIssues = columnData?.status || []
            const columnPoints = columnData?.points ?? 0

            return (
              <div
                key={column.status}
                className="flex-shrink-0 w-64 sm:w-72 bg-background rounded-lg flex flex-col h-full"
              >
                <div className="p-4">
                  <div
                    className={`${column.bgColor} ${column.textColor} w-full p-2 flex rounded-full gap-4 justify-between`}
                  >
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-black/20">
                      {columnIssues.length}
                    </span>
                    <h3 className="font-semibold text-lg truncate">
                      {column.status}
                    </h3>
                    <div className="text-xs opacity-90 p-2 rounded-full bg-white text-black">
                      {columnPoints}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                  {columnIssues.length > 0 ? (
                    columnIssues.map((issue) => (
                      <IssuesCard key={issue.id} issue={issue} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <IconClipboardText size={42} />
                      <p className="text-sm mt-2">No hay tareas</p>
                      <p className="text-xs mt-1 text-gray-500 text-center">
                        {filters.teamId !== "all" || filters.assigned !== "all"
                          ? "Intenta cambiar los filtros"
                          : "No hay tareas en esta columna"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
