'use client'

import { useEffect, useState } from 'react'
import { fetchAllIssues } from '@/lib/jiraApi'
import { JiraIssue } from '@/types/jira'

export const useJiraDashboard = () => {
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let allIssues: JiraIssue[] = []
      let nextPageToken: string | undefined = undefined

      do {
        const response = await fetchAllIssues(nextPageToken)
        allIssues = [...allIssues, ...(response.issues || [])]
        nextPageToken = response.nextPageToken
      } while (nextPageToken)

      setIssues(allIssues)
    } catch (err: any) {
      setError(err?.message || 'Error cargando dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return {
    issues,
    isLoading,
    error,
    refetch: loadDashboard
  }
}