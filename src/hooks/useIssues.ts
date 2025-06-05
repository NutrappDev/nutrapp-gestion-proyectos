import { useState, useEffect, useCallback } from 'react';
import { fetchIssues } from '../api/jiraApi';
import type { JiraIssue } from '../types/jira';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  isLast: boolean;
}


export const useIssues = () => {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    project?: string;
    assignee?: string;
  }>({});
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 50,
    total: 0,
    isLast: false
  });

  const loadIssues = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      console.log(filters.assignee)
      const { issues, total, isLast } = await fetchIssues({
        project: filters.project
      });

      setIssues(issues);
      setPagination(prev => ({
        ...prev,
        page,
        total,
        isLast
      }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize]);

  const updateFilter = useCallback((key: 'project' | 'assignee', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || (pagination.isLast && page > pagination.page)) return;
    loadIssues(page);
  }, [pagination.isLast, pagination.page, loadIssues]);

  useEffect(() => {
    loadIssues(1);
  }, [filters, pagination.pageSize, loadIssues]);

  return { 
    issues, 
    loading, 
    error, 
    refresh: () => loadIssues(pagination.page),
    filters,
    pagination,
    updateFilter,
    resetFilters,
    goToPage,
    setPageSize: (size: number) => setPagination(prev => ({ ...prev, pageSize: size }))
  };
};