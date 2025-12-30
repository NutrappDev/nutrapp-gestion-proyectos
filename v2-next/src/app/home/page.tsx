'use client'

import { useTeams } from "@/hook/useTeams"
import Card from "@/components/Cards/cardsIssues"
import CardUsers from "@/components/Cards/cardsUsers"
import { useState, useRef, useMemo } from "react"
import { KanbanColumn } from "@/components/Kanban/KanbanColumn"
import { FilterKanban } from "@/components/Filter/FilterKanban"
import { Member } from "@/types/team"

export default function HomePage() {
  const { teams, isLoading } = useTeams()
  const containerRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState({
    teamId: 'all',
    assigned: 'all',
    status: 'all',
  })

  const [view, setView] = useState<'kanban' | 'timeline'>('kanban')

  const selectedTeam = useMemo(
    () => teams.find(team => team.id === filters.teamId),
    [teams, filters.teamId]
  )

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Home
        </h1>

        <div
          ref={containerRef}
          className="flex p-2 justify-center w-full gap-2 sm:gap-4 flex-wrap sm:flex-nowrap mb-4 overflow-auto"
        >
          {filters.teamId === 'all' &&
            teams.map(team => (
              <Card
                key={team.id}
                name={team.name}
                label={team.label}
                members={team.members.length}
                initials={team.initials}
                color={team.color}
                isSelected={false}
                onClick={() =>
                  setFilters(prev => ({
                    ...prev,
                    teamId: team.id,
                    assigned: 'all',
                  }))
                }
              />
            ))}

          {filters.teamId !== 'all' &&
            selectedTeam?.members.map((member: Member) => {
              const initials = getInitials(member.displayName)

              return (
                <CardUsers
                  key={member.displayName}
                  name={member.displayName}
                  label="Miembro"
                  members={0}
                  initials={initials}
                  color={selectedTeam.color}
                  isSelected={filters.assigned === member.displayName}
                  onClick={() =>
                    setFilters(prev => ({
                      ...prev,
                      assigned:
                        prev.assigned === member.displayName
                          ? 'all'
                          : member.displayName,
                    }))
                  }
                />
              )
            })}
        </div>

        {/* BOTÓN VOLVER */}
        {filters.teamId !== 'all' && (
          <button
            className="mb-4 text-sm text-primary hover:underline"
            onClick={() =>
              setFilters(prev => ({
                ...prev,
                teamId: 'all',
                assigned: 'all',
              }))
            }
          >
            ← Volver a equipos
          </button>
        )}

        <FilterKanban
          teams={teams}
          value={filters}
          view={view}
          onChange={setFilters}
          onViewChange={setView}
        />
      </div>

      <div className="flex-1 h-full p-4 bg-background">
        {view === 'timeline' ? (
          <div className="h-full bg-surface rounded-lg p-6 shadow border border-border">
            timeline
          </div>
        ) : (
          <KanbanColumn filters={filters} />
        )}
      </div>
    </div>
  )
}
