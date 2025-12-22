import {
  fetchAssigneesWithStats,
  fetchIssues,
  fetchUsers,
  fetchProjects,
  FetchIssuesParams
} from '@/lib/jiraApi'
import { useEffect, useRef, useState } from 'react'
import { JiraIssue } from '@/types/jira'

export const useJira = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [totalIssues, setTotalIssues] = useState(0)
  const [isLast, setIsLast] = useState(false)

  const hasFetched = useRef(false)

  const getIssues = async (params?: FetchIssuesParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchIssues(params || {})

      const allIssues: JiraIssue[] = []
      Object.values(response.data).forEach(statusGroup => {
        allIssues.push(...statusGroup.issues)
      })

      setIssues(allIssues)
      setTotalIssues(response.total)
      setIsLast(response.isLast)
    } catch (error: any) {
      setError(error.message || 'Error al obtener issues de Jira')
      console.error('Error fetching issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAssigneesWithStats = async (assignees: string | string[]) => {
    try {
      return await fetchAssigneesWithStats(assignees)
    } catch (error: any) {
      setError(error.message || 'Error al obtener asignados')
      throw error
    }
  }

  const getUsers = async () => {
    try {
      return await fetchUsers()
    } catch (error: any) {
      setError(error.message || 'Error al obtener usuarios')
      throw error
    }
  }

  const getProjects = async () => {
    try {
      return await fetchProjects()
    } catch (error: any) {
      setError(error.message || 'Error al obtener proyectos')
      throw error
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    getIssues()
  }, [])

  return {
    isLoading,
    issues,
    error,
    totalIssues,
    isLast,

    getIssues,
    getAssigneesWithStats,
    getUsers,
    getProjects,

    setIssues,
    setError,
    setIsLoading
  }
}
