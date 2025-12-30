'use client'

import { useEffect, useState } from 'react'
import { Team, TEAMS, Member } from '../types/team'
import { useJira } from './useJira'
import { formatDisplayName } from '@/utils/jira'

const normalizeName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

export const useTeams = () => {
  const { OnlyUsers, isLoading: isLoadingUsers } = useJira({ viewUsers: true })
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!OnlyUsers || OnlyUsers.length === 0) return

    const jiraUsersMap = new Map(
      OnlyUsers.map(user => [
        normalizeName(user.displayName),
        user,
      ])
    )

    const enrichedTeams: Team[] = TEAMS.map(team => {
      const members: Member[] = []

      team.members.forEach(member => {
        const jiraUser = jiraUsersMap.get(
          normalizeName(member.displayName)
        )

        if (!jiraUser) return

        members.push({
          displayName: formatDisplayName(jiraUser.displayName),
          accountId: jiraUser.accountId,
          avatarUrls: jiraUser.avatarUrls,
          email: jiraUser.email,
          accountType: jiraUser.accountType,
        })
      })

      return {
        ...team,
        members,
      }
    })

    setTeams(enrichedTeams)
    setIsLoading(false)
  }, [OnlyUsers])

  return {
    teams,
    isLoading: isLoading || isLoadingUsers,
  }
}
