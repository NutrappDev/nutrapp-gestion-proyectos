'use client'

import {
  fetchIssuesByProject,
  fetchUsers,
  fetchProjects,
  fetchIssuesByUser,
} from '@/lib/jiraApi'
import { useEffect, useRef, useState } from 'react'
import { JiraIssue, JiraProject, JiraUsers } from '@/types/jira'
import { getUptimeRobotMonitoring } from '@/lib/uptimeRobotApi'

interface UseJiraProps {
  viewIssuesProjects?: boolean
  viewIssuesUsers?: boolean
  viewUsers?: boolean
  project?: JiraProject
}

export const useJira = ({
  viewIssuesProjects = false,
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
  const [error, setError] = useState<string | null>(null)
  const [OnlyUsers, setOnlyUsers] = useState<JiraUsers[]>([])

  const issuesCache = useRef<Record<string, JiraIssue[]>>({})
  const isFetchingUsers = useRef(false)

  /* ---------------- USERS ---------------- */

  const getUsers = async () => {
    if (isFetchingUsers.current) return
    isFetchingUsers.current = true

    setIsLoading(true)
    try {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)

      const allIssues: JiraIssue[] = []

      for (const user of fetchedUsers) {
        if (!user.accountId) continue

        if (issuesCache.current[user.accountId]) {
          allIssues.push(...issuesCache.current[user.accountId])
          continue
        }

        const response = await fetchIssuesByUser(user.accountId)

        const userIssues: JiraIssue[] = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.issues)
            ? (response as any).issues
            : []

        issuesCache.current[user.accountId] = userIssues
        allIssues.push(...userIssues)
      }

      setIssuesByUser(allIssues)
      return fetchedUsers
    } catch (err: any) {
      setError(err?.message || 'Error al obtener usuarios')
      throw err
    } finally {
      setIsLoading(false)
      isFetchingUsers.current = false
    }
  }

  const getOnlyUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers()
      setOnlyUsers(fetchedUsers)
      return fetchedUsers
    } catch (err: any) {
      setError(err?.message || 'Error al obtener usuarios')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- PROJECTS ---------------- */

  const getProjects = async () => {
    setIsLoading(true)
    try {
      const fetchedProjects = await fetchProjects()
      setProjects(fetchedProjects.values ?? [])
      return fetchedProjects.values
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
        return {
          total: 0,
          done: 0,
          progress: 0,
        }
      }

      const done = issues.filter(
        (issue) => issue.fields.status.statusCategory.key === 'done'
      ).length

      const progress = Math.round((done / total) * 100)

      return {
        total,
        done,
        progress,
      }
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

  useEffect(() => {
    if (viewIssuesProjects) {
      getProjects()
    }
  }, [viewIssuesProjects])

  useEffect(() => {
    if (viewIssuesUsers) {
      getUsers()
    }
  }, [viewIssuesUsers])

  useEffect(() => {
    if (viewUsers) {
      getOnlyUsers()
    }
  }, [viewUsers])

  useEffect(() => {
    if (project) {
      getIssuesByProject(project)
    }
  }, [project])

  return {
    isLoading,
    isLoadingIssues,
    issues,
    issuesByUser,
    projects,
    users,
    OnlyUsers,
    error,
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
