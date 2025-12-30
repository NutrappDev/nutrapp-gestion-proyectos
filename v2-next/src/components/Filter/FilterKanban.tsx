'use client'

import { formatDisplayName } from '@/utils/jira'
import {
  IconRefresh,
} from '@tabler/icons-react'

interface FilterKanbanProps {
  teams: {
    id: string
    name: string
    label?: string
    members?: {
      displayName: string
      accountId?: string
    }[]
  }[]
  value: {
    teamId: string
    assigned: string
    status: string
  }
  onChange: (filters: {
    teamId: string
    assigned: string
    status: string
  }) => void
}

export const FilterKanban = ({
  teams,
  value,
  onChange,
}: FilterKanbanProps) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'Backlog', label: 'Backlog' },
    { value: 'Por hacer', label: 'Por hacer' },
    { value: 'En proceso', label: 'En proceso' },
    { value: 'Revisión QA', label: 'Revisión QA' },
    { value: 'Detenido', label: 'Detenido' },
  ]


  const selectedTeam = teams.find(team => team.id === value.teamId)

  const handleClear = () => {
    onChange({
      teamId: 'all',
      assigned: 'all',
      status: 'all',
    })
  }

  return (
    <div
      className="
        sticky top-0 z-20
        bg-background
        p-4 rounded-t-lg
        shadow-sm w-full
        flex flex-col sm:flex-row
        justify-start sm:justify-between
        items-start sm:items-center
        gap-4 sm:justify-end
      "
    >

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Equipo
          </label>
          <select
            value={value.teamId}
            onChange={e =>
              onChange({
                ...value,
                teamId: e.target.value,
                assigned: 'all',
              })
            }
            className="w-full px-3 py-2 bg-background rounded-lg border"
          >
            <option value="all">Todos los equipos</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.label || team.name}
              </option>
            ))}
          </select>
        </div>

        {value.teamId !== 'all' && selectedTeam?.members && (
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Miembro
            </label>
            <select
              value={value.assigned}
              onChange={e =>
                onChange({ ...value, assigned: e.target.value })
              }
              className="w-full px-3 py-2 bg-background rounded-lg border"
            >
              <option value="all">Todos</option>
              {selectedTeam.members.map(member => (
                <option
                  key={member.accountId || member.displayName}
                  value={formatDisplayName(member.displayName)}
                >
                  {formatDisplayName(member.displayName)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Estado
          </label>
          <select
            value={value.status}
            onChange={e =>
              onChange({ ...value, status: e.target.value })
            }
            className="w-full px-3 py-2 bg-background rounded-lg border"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClear}
            className="
              flex items-center gap-2
              rounded-full bg-primary
              px-4 py-2 text-white
              text-xs font-semibold
              hover:opacity-90
            "
          >
            <IconRefresh size={16} />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}
