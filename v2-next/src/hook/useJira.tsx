'use client'

import {
  fetchIssuesByProject,
  fetchUsers,
  fetchProjects,
  fetchIssuesByUser,
  fetchAllIssues,
} from '@/lib/jiraApi'
import { useEffect, useRef, useState } from 'react'
import { JiraIssue, JiraProject, JiraProjectsResponse, JiraUsers } from '@/types/jira'
import { formatDisplayName } from '@/utils/jira'

interface UseJiraProps {
  viewProjects?: boolean
  viewIssuesUsers?: boolean
  viewUsers?: boolean
  project?: JiraProject
}

export const useJira = ({
  viewProjects = false,
  viewIssuesUsers = false,
  viewUsers = false,
  project,
}: UseJiraProps = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingIssues, setIsLoadingIssues] = useState(false)
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [issuesByUser, setIssuesByUser] = useState<JiraIssue[]>([])
  const [projects, setProjects] = useState<JiraProject[]>([])
  const [users, setUsers] = useState<JiraUsers[]>([])
  const [OnlyUsers, setOnlyUsers] = useState<JiraUsers[]>([])
  const [error, setError] = useState<string | null>(null)
  const [responseProjects, setResponseProjects] = useState<JiraProjectsResponse | null>()

  const issuesCache = useRef<Record<string, JiraIssue[]>>({})
  const isFetchingUsers = useRef(false)
  const usersCache = useRef<{ users: JiraUsers[]; usersMap: Map<string, JiraUsers> } | null>(null);

  /* ---------------- USERS ---------------- */
  const getUsers = async () => {
    if (isFetchingUsers.current) return;
    isFetchingUsers.current = true;

    setIsLoading(true);
    setError(null);

    try {
      if (usersCache.current) {
        setUsers(usersCache.current.users); 
        return usersCache.current;
      }

      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);

      const usersMap = new Map(fetchedUsers.map(u => [formatDisplayName(u.displayName), u]))
      usersCache.current = { users: fetchedUsers, usersMap };

      const allIssues: JiraIssue[] = [];

      fetchedUsers.forEach(async (user) => {
        if (!user.accountId) return;

        if (issuesCache.current[user.accountId]) {
          setIssuesByUser(prev => [...prev, ...issuesCache.current[user.accountId]]);
          return;
        }

        try {
          const response = await fetchIssuesByUser(user.accountId);
          const userIssues: JiraIssue[] = Array.isArray(response)
            ? response
            : Array.isArray((response as any)?.issues)
              ? (response as any).issues
              : [];

          issuesCache.current[user.accountId] = userIssues;

          setIssuesByUser(prev => [...prev, ...userIssues]);
        } catch {
          return;
        }
      });

      return fetchedUsers;
    } catch (err: any) {
      setError(err?.message || 'Error al obtener usuarios');
      throw err;
    } finally {
      setIsLoading(false);
      isFetchingUsers.current = false;
    }
  };

  const getOnlyUsers = async () => {
    if (usersCache.current) {
      setOnlyUsers(usersCache.current.users); 
      return usersCache.current; 
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedUsers = await fetchUsers();
      if (!Array.isArray(fetchedUsers)) throw new Error('Respuesta inválida');

      const usersMap = new Map(fetchedUsers.map(u => [formatDisplayName(u.displayName), u]));

      usersCache.current = { users: fetchedUsers, usersMap };

      setOnlyUsers(fetchedUsers); 

      return usersCache.current; 
    } catch (err: any) {
      const message = err?.message || 'Error al obtener usuarios';
      console.error(message);
      setError(message);
      return { users: [], usersMap: new Map() };
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- PROJECTS ---------------- */
  const getProjects = async () => {
    setIsLoading(true)
    try {
      const fetchedProjects = await fetchProjects()

      const filteredProjects =
        fetchedProjects.values?.filter(
          (project: JiraProject) =>
            project.name?.toUpperCase().startsWith("DG")
        ) ?? []

      setProjects(filteredProjects)
      setResponseProjects({
        ...fetchedProjects,
        values: filteredProjects,
        total: filteredProjects.length,
      })

      return filteredProjects
    } catch (err: any) {
      setError(err?.message || 'Error al obtener proyectos')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getProgresProject = async (project: JiraProject) => {
    try {
      setIsLoading(true)

      const projectIssues = await fetchIssuesByProject(project.name)
      const issues = projectIssues.flat()
      const total = issues.length

      if (total === 0) {
        return { total: 0, done: 0, progress: 0 }
      }

      const done = issues.filter(issue => issue.fields.status.statusCategory.key === 'done').length
      const progress = Math.round((done / total) * 100)

      return { total, done, progress }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener progreso')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- ISSUES ---------------- */
  const getIssuesByProject = async (project: JiraProject) => {
    setIsLoadingIssues(true)
    try {
      const projectIssues = await fetchIssuesByProject(project.name)
      setIssues(projectIssues.flat())
    } catch (err: any) {
      setError(err?.message || 'Error al obtener issues del proyecto')
      throw err
    } finally {
      setIsLoadingIssues(false)
    }
  }

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => { if (viewProjects) getProjects() }, [viewProjects])
  useEffect(() => { if (viewIssuesUsers) getUsers() }, [viewIssuesUsers])
  useEffect(() => { if (viewUsers) getOnlyUsers() }, [viewUsers])
  useEffect(() => { if (project) getIssuesByProject(project) }, [project])

  return {
    isLoading,
    isLoadingIssues,
    issues,
    issuesByUser,
    projects,
    users,
    OnlyUsers,
    error,
    responseProjects,
    getUsers,
    getOnlyUsers,
    getProjects,
    getIssuesByProject,
    getProgresProject,
    setIssues,
    setError,
    setIsLoading,
  }
}
