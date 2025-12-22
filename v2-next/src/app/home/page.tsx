'use client';

import { useTeams } from "@/hook/useTeams";
import Card from "@/components/cards";
import { useState, useRef } from "react";
import { KanbanColumn } from "@/components/Kanban/KanbanColumn";
import { FilterKanban } from "@/components/Filter/FilterKanban";

export default function HomePage() {
  const { teams, isLoading } = useTeams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    teamId: 'all',
    assigned: 'all',
    status: 'all', 
  });

  const [view, setView] = useState<'kanban' | 'timeline'>('kanban');

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Home
        </h1>

        <div
          ref={containerRef}
          className="flex justify-center gap-4 flex-wrap mb-4"
        >
          {teams.map(team => (
            <Card
              key={team.id}
              name={team.name}
              label={team.label}
              members={team.members.length}
              initials={team.initials}
              color={team.color}
              isSelected={filters.teamId === team.id}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  teamId: prev.teamId === team.id ? 'all' : team.id,
                }))
              }
            />
          ))}
        </div>

        <FilterKanban
          teams={teams}
          value={filters}
          view={view}
          onChange={setFilters}
          onViewChange={setView}
        />
      </div>

      <div className="flex-1 min-h-[100%] sm:min-h-[80%] mt-4">
        {view === 'timeline' ? (
          <div className="h-full bg-surface rounded-lg p-6 shadow border border-border">
            timeline
          </div>
        ) : (
          <KanbanColumn filters={filters} />
        )}
      </div>
    </div>
  );
}