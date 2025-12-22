'use client';

import { IconTimeline, IconLayoutKanban } from '@tabler/icons-react';

interface FilterKanbanProps {
  teams: {
    id: string;
    name: string;
    label?: string;
  }[];
  value: {
    teamId: string;
    assigned: string;
    status: string;
  };
  view: 'kanban' | 'timeline';
  onChange: (filters: {
    teamId: string;
    assigned: string;
    status: string;
  }) => void;
  onViewChange: (view: 'kanban' | 'timeline') => void;
}

export const FilterKanban = ({
  teams,
  value,
  view,
  onChange,
  onViewChange,
}: FilterKanbanProps) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'todo', label: 'Por hacer' },
    { value: 'in-progress', label: 'En curso' },
    { value: 'waiting-approval', label: 'Esperando aprobación' },
    { value: 'blocked', label: 'Detenida' },
  ];

  return (
    <div
      className="
        sticky top-0 z-20
        bg-background
        p-4
        rounded-t-lg
        shadow-sm
        w-full
        flex flex-col sm:flex-row
        justify-start sm:justify-between
        items-start sm:items-center
        gap-4
      "
    >
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          className={`bg-surface p-2 flex gap-2 rounded cursor-pointer items-center ${view === 'kanban' ? 'ring-2 ring-primary' : ''
            }`}
          onClick={() => onViewChange('kanban')}
        >
          <IconLayoutKanban />
          <span className="hidden sm:inline">List view</span>
        </button>

        <button
          className={`bg-surface p-2 flex gap-2 rounded cursor-pointer items-center ${view === 'timeline' ? 'ring-2 ring-primary' : ''
            }`}
          onClick={() => onViewChange('timeline')}
        >
          <IconTimeline />
          <span className="hidden sm:inline">Timeline</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="team" className="text-sm font-medium mb-1 text-gray-700">
            Equipo
          </label>
          <select
            id="team"
            value={value.teamId}
            onChange={(e) => onChange({ ...value, teamId: e.target.value })}
            className="w-full px-3 py-2 bg-background rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">Todos los equipos</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.label || team.name}
              </option>
            ))}   
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-auto ">
          <label htmlFor="assigned" className="text-sm font-medium mb-1 text-gray-700">
            Asignación
          </label>
          <select
            id="assigned"
            value={value.assigned}
            onChange={(e) => onChange({ ...value, assigned: e.target.value })}
            className="w-full px-3 py-2 bg-background rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">Todos</option>
            <option value="assigned">Asignados</option>
            <option value="unassigned">No asignados</option>
          </select>
        </div>

        <div className="flex flex-col w-full sm:hidden">
          <label htmlFor="status" className="text-sm font-medium mb-1 text-gray-700">
            Estado
          </label>
          <select
            id="status"
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value })}
            className="w-full px-3 py-2 bg-background rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};