const daysBetween = (start: Date, end: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())

  return Math.max(
    Math.floor((endUTC - startUTC) / msPerDay) + 1,
    1
  )
}

export const getIssueProgressByComments = (
  issue: any
): number => {
  const startDateRaw =
    issue.fields.customfield_startDate || issue.fields.created
  const dueDateRaw = issue.fields.duedate

  if (!dueDateRaw) return 0

  const startDate = new Date(startDateRaw)
  const dueDate = new Date(dueDateRaw)

  const expectedComments = daysBetween(startDate, dueDate)
  const currentComments = issue.fields.comment?.total ?? 0

  const progress = (currentComments / expectedComments) * 100

  return Math.min(Math.round(progress), 100)
}


export const getEpicProgressByDoneIssues = (
  epicId: string,
  issues: any[]
): number => {
  const epicIssues = issues.filter(
    (i) => i.fields.parent?.id === epicId
  )

  if (epicIssues.length === 0) return 0

  const doneIssues = epicIssues.filter(
    (i) => i.fields.status?.statusCategory?.key === "done"
  )

  const progress = (doneIssues.length / epicIssues.length) * 100

  return Math.round(progress)
}

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export const formatDisplayName = (name: string): string => {
  if (!name) return ''

  const clean = name
    .trim()
    .split(/\s+/)
    .map(part =>
      part
        .normalize('NFD')
        .replace(/[\u0301\u0300\u0302\u0308]/g, '') 
        .toLowerCase()
    )

  if (clean.length === 1) {
    return capitalize(clean[0])
  }

  const firstName = clean[0]
  const lastName = clean[clean.length - 1]

  return `${capitalize(firstName)} ${capitalize(lastName)}`
}

