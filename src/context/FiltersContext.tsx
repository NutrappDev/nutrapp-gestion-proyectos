import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface Filters {
  project?: string;
  assignee?: string;
}

interface FiltersContextType {
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string | undefined) => void;
  resetFilters: () => void;
  pageSize: number;
  setPageSize: (size: number) => void;
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

  const value = useMemo(() => ({
    filters,
    updateFilter,
    resetFilters,
    pageSize,
    setPageSize,
  }), [filters, updateFilter, resetFilters, pageSize]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFiltersContext must be used within a FiltersProvider');
  }
  return context;
};