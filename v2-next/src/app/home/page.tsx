'use client'

import { useTeams } from "@/hook/useTeams"
import Card from "@/components/Cards/cardsIssues"
import CardUsers from "@/components/Cards/cardsUsers"
import { useState, useRef, useMemo } from "react"
import { KanbanColumn } from "@/components/Kanban/KanbanColumn"
import { FilterKanban } from "@/components/Filter/FilterKanban"
import { Member } from "@/types/team"
import { useJira } from "@/hook/useJira"
import { countIssuesForMember } from "@/utils/jira"

export default function HomePage() {
  const { teams, isLoadingTeams } = useTeams()
  const { issuesByUser, isLoading, error } = useJira({ viewIssuesUsers: true })

  const containerRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState({
    teamId: 'all',
    assigned: 'all',
    status: 'all',
  })


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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Home
        </h1>

        <div
          ref={containerRef}
          className="flex p-2 justify-center-safe w-full gap-2 sm:gap-4 flex-wrap sm:flex-nowrap mb-4 overflow-auto"
        >
          {isLoadingTeams && (
            <div>Cargando...</div>
          )}

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
              const initials = getInitials(member.displayName);
              const countIssues = countIssuesForMember(member.displayName, issuesByUser);

              return (
                <CardUsers
                  key={member.displayName}
                  name={member.displayName}
                  label="Miembro"
                  members={countIssues}
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
              );
            })}
        </div>

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
          onChange={setFilters}
        />
      </div>

      <div className="flex-1 h-full p-4 bg-background">
        <KanbanColumn filters={filters} issuesByUser={issuesByUser} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
