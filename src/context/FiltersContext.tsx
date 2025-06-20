import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { TEAMS } from '@/constants/team';

interface Filters {
  project?: string;
  assignee?: string;
  teamId?: string;
}

interface FiltersContextType {
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string | undefined) => void;
  resetFilters: () => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  getSelectedTeamMembers: () => string[] | undefined;
  getSelectedTeamName: () => string | undefined;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>({});
  const [pageSize, setPageSizeState] = useState<number>(50);

  const updateFilter = useCallback((key: keyof Filters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
  }, []);

  const getSelectedTeamMembers = useCallback(() => {
    if (!filters.teamId) return undefined;
    const selectedTeam = TEAMS.find(team => team.id === filters.teamId);
    return selectedTeam?.members;
  }, [filters.teamId]);

  const getSelectedTeamName = useCallback(() => {
    if (!filters.teamId) return undefined;
    const selectedTeam = TEAMS.find(team => team.id === filters.teamId);
    return selectedTeam?.name;
  }, [filters.teamId]);

  const value = useMemo(() => ({
    filters,
    updateFilter,
    resetFilters,
    pageSize,
    setPageSize,
    getSelectedTeamMembers,
    getSelectedTeamName,
  }), [filters, updateFilter, resetFilters, pageSize, getSelectedTeamMembers, getSelectedTeamName]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFiltersContext must be used within a FiltersProvider');
  }
  return context;
};