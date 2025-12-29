import {
  fetchIssuesByProject,
  fetchUsers,
  fetchProjects,
  fetchIssuesByUser,
  fetchProjectProgress,
} from '@/lib/jiraApi'
import { useEffect, useRef, useState } from 'react'
import { JiraIssue, JiraProject, JiraUsers } from '@/types/jira'

interface UseJiraProps {
  viewIssuesProjects?: boolean
  viewIssuesUsers?: boolean
  project?: JiraProject
}

export const useJira = ({
  viewIssuesProjects,
  viewIssuesUsers,
  project,
}: UseJiraProps = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingIssues, setIsLoadingIssues] = useState(false)
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<JiraProject[]>([])
  const [users, setUsers] = useState<JiraUsers[]>([])
  const [issuesByUser, setIssuesByUser] = useState<JiraIssue[]>([])

  const hasFetched = useRef(false)

  const getUsers = async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await fetchUsers()

      const assignableUsers = fetchedUsers.filter(
        (user) => user.accountType === 'atlassian'
      )

      setUsers(assignableUsers)

      if (assignableUsers.length) {
        const issuesByProject = await Promise.all(
          assignableUsers.map((user) =>
            fetchIssuesByUser(user.accountId)
          )
        )

        setIssuesByUser(issuesByProject.flat())
      }

      return assignableUsers
    } catch (err: any) {
      setError(err?.message || 'Error al obtener usuarios')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (viewIssuesProjects) {
      getProjects()
    }

    if (viewIssuesUsers) {
      getUsers()
    }

    if (project) {
      getIssuesByProject(project)
    }
  }, [viewIssuesProjects, viewIssuesUsers, project])

  return {
    isLoading,
    issues,
    error,
    projects,
    users,
    issuesByUser,
    isLoadingIssues,
    getUsers,
    getProjects,
    getIssuesByProject,
    getProgresProject,
    setIssues,
    setError,
    setIsLoading,
  }
}
