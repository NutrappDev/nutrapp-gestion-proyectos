import { useJira } from "@/hook/useJira"
import { IconClipboardText } from "@tabler/icons-react"
import { IssuesCard } from "../Issues/IssuesCards"
import { JiraIssue } from "@/types/jira"
import { useMemo } from "react"
import { findTeamByAssignee } from "@/types/team"

interface ColumnData {
  status: JiraIssue[]
  total: number
}

interface GroupedIssues {
  [key: string]: ColumnData
}

interface KanbanColumnProps {
  filters: {
    teamId: string;
    assigned: string;
    status: string;
  }
}

export const KanbanColumn = ({ filters }: KanbanColumnProps) => {
  const { issues, isLoading, error } = useJira()

  const rawIssues = Array.isArray(issues) ? issues : []

  const columns = [
    { status: 'Por hacer', id: 'todo', bgColor: 'bg-blue-600', textColor: 'text-white' },
    { status: 'En curso', id: 'in-progress', bgColor: 'bg-yellow-600', textColor: 'text-white' },
    { status: 'Esperando aprobación', id: 'waiting-approval', bgColor: 'bg-purple-600', textColor: 'text-white' },
    { status: 'Detenida', id: 'blocked', bgColor: 'bg-red-600', textColor: 'text-white' },
  ]

  const normalizeName = (name: string): string => {
    return name.trim().toLowerCase()
  }

  const filteredIssues = useMemo(() => {
    return rawIssues.filter((issue: JiraIssue) => {
      const issueAssignee = issue.assignee ? normalizeName(issue.assignee.name) : null

      if (filters.assigned !== 'all') {
        if (filters.assigned === 'assigned' && !issueAssignee) {
          return false
        }
        if (filters.assigned === 'unassigned' && issueAssignee) {
          return false
        }
      }

      if (filters.teamId !== 'all') {
        if (!issueAssignee) {
          return false
        }

        const assigneeTeam = findTeamByAssignee(issueAssignee)
        
        if (!assigneeTeam || assigneeTeam.id !== filters.teamId) {
          return false
        }
      }

      if (filters.status && filters.status !== 'all') {
        const statusMap: Record<string, string[]> = {
          'pending': ['Por hacer'],
          'in-progress': ['En curso'],
          'waiting': ['Esperando aprobación'],
          'blocked': ['Detenida']
        }
        
        const allowedStatuses = statusMap[filters.status]
        if (allowedStatuses && !allowedStatuses.includes(issue.status)) {
          return false
        }
      }

      return true
    })
  }, [rawIssues, filters.assigned, filters.teamId, filters.status])

  const groupedIssues: GroupedIssues = useMemo(() => {
    return columns.reduce((acc, column) => {
      const filtered = filteredIssues.filter(
        (issue: JiraIssue) =>
          issue.status === column.status ||
          issue.statusCategory === column.status
      )

      acc[column.status] = {
        status: filtered,
        total: filtered.length,
      }

      return acc
    }, {} as GroupedIssues)
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
    <div className="h-full bg-surface rounded-lg shadow border border-border overflow-hidden">
      <div className="h-full overflow-x-auto overflow-y-hidden p-4">
        <div className="h-full flex gap-4">
          {columns.map(column => {
            const columnData = groupedIssues[column.status]
            const columnIssues = columnData?.status || []

            return (
              <div
                key={column.id}
                className="
                  flex-shrink-0
                  w-72
                  bg-white
                  border
                  border-gray-200
                  rounded-lg
                  flex
                  flex-col
                  h-full
                "
              >
                <div className={`${column.bgColor} ${column.textColor} p-4 flex-none`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg truncate">
                      {column.status}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-black/20">
                      {columnIssues.length}
                    </span>
                  </div>
                  <div className="text-xs opacity-90 mt-1">
                    {columnIssues.length} tarea{columnIssues.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {columnIssues.length > 0 ? (
                    columnIssues.map(issue => (
                      <IssuesCard key={issue.id} issue={issue} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <IconClipboardText size={42} />
                      <p className="text-sm mt-2">No hay tareas</p>
                      <p className="text-xs mt-1 text-gray-500 text-center">
                        {filters.teamId !== 'all' || filters.assigned !== 'all' ? 
                          'Intenta cambiar los filtros' : 
                          'No hay tareas en esta columna'}
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