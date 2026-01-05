'use client'

import { MetricCard } from "@/components/Dashboard/MetricsCard"
import { useJira } from "@/hook/useJira"
import { useJiraDashboard } from "@/hook/useMetrics"
import { IconFlag3Filled } from "@tabler/icons-react"
import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

const ISSUE_STATES = [
  'Por hacer', 'Backlog', 'En proceso',
  'Revisión QA', 'Esperando aprobación',
  'Detenido', 'Actividad completada'
] as const

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']

export default function DashboardPage() {
  const { isLoading, error, issues = [] } = useJiraDashboard()
  const { projects = [] } = useJira({ viewProjects: true })
  const today = new Date()

  const metrics = useMemo(() => {
    const issuesByState: Record<string, number> = {}
    const issuesByPriority: Record<string, number> = { Alta: 0, Baja: 0 }
    const issuesAlert: any[] = []
    const epicMap: Record<string, { epic: any, issues: any[] }> = {}
    let overdueIssues = 0

    issues.forEach(issue => {
      const status = issue.fields?.status?.name?.trim()
      const statusCategory = issue.fields?.status?.statusCategory?.name?.trim()
      const priority = issue.fields?.priority?.name
      const dueDateStr = issue.fields?.duedate
      const summary = issue.fields?.summary
      const key = issue.key

      if (status) issuesByState[status] = (issuesByState[status] || 0) + 1
      if (priority) issuesByPriority[priority] = (issuesByPriority[priority] || 0) + 1

      if (dueDateStr) {
        const dueDate = new Date(dueDateStr)
        if (dueDate < today && status?.toLowerCase() !== 'actividad completada') overdueIssues++

        if (status?.toLowerCase() !== 'actividad completada' && statusCategory?.toLowerCase() !== 'listo') {
          const diffInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          let colorClass = ''
          let icon = null
          if (diffInDays <= 3) {
            colorClass = 'border-b-2 border-red-600'
            icon = <IconFlag3Filled className="inline w-4 h-4 text-red-600 mr-1" />
          } else if (diffInDays <= 5) {
            colorClass = 'border-b-2 border-yellow-400'
            icon = <IconFlag3Filled className="inline w-4 h-4 text-yellow-600 mr-1" />
          } else {
            colorClass = 'border-b-2 border-green-400'
            icon = <IconFlag3Filled className="inline w-4 h-4 text-green-600 mr-1" />
          }
          issuesAlert.push({ id: key, summary, status, dueDate, diffInDays, colorClass, icon })
        }
      }

      if (issue.fields?.issuetype?.name === 'Epic') {
        epicMap[key] = { epic: issue, issues: [] }
      } else if (issue.fields?.parent?.key) {
        const epicKey = issue.fields.parent.key
        if (!epicMap[epicKey]) epicMap[epicKey] = { epic: null, issues: [] }
        epicMap[epicKey].issues.push(issue)
      }
    })

    const epicProgress = Object.values(epicMap)
      .filter(e => e.epic && e.issues.length > 0)
      .map(e => ({
        name: e.epic.fields.summary,
        issuesByState: ISSUE_STATES.map(state => ({
          name: state,
          value: e.issues.filter(i => i.fields?.status?.name?.trim() === state).length
        }))
      }))

    return { issuesByState, issuesByPriority, overdueIssues, issuesAlert, epicProgress }
  }, [issues, today])


  const totalIssues = issues.length
  const activeProjects = projects.filter(p => issues.some(i => i.fields?.project?.name === p.name)).length
  const avgIssuesPerProject = projects.length > 0 ? (totalIssues / projects.length).toFixed(2) : 0
  const progressPercent = totalIssues > 0
    ? ((metrics.issuesByState['Actividad completada'] || 0) / totalIssues * 100).toFixed(0)
    : 0

  const progressByProject = projects.map(project => {
    const projectIssues = issues.filter(i => i.fields?.project?.name === project.name)
    const total = projectIssues.length
    const completed = projectIssues.filter(
      i => i.fields?.status?.name?.trim() === 'Actividad completada' ||
        i.fields?.status?.statusCategory?.name?.toLowerCase() === 'listo'
    ).length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    return { project: project.name, progress }
  })

  const LoadingDots = () => (
    <div className="rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )

  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="h-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <section className="bg-background p-4 rounded flex flex-wrap gap-3">
        <MetricCard title="Proyectos totales" value={projects.length} />
        <MetricCard title="Proyectos activos" value={activeProjects} />
        <MetricCard title="Issues totales" value={isLoading ? <LoadingDots /> : totalIssues} />
        <MetricCard title="Promedio de issues/proyecto" value={avgIssuesPerProject} />
        <MetricCard title="Avance (%)" value={`${progressPercent}%`} />
        <MetricCard title="Issues vencidos" value={metrics.overdueIssues} />
        {Object.entries(metrics.issuesByPriority).map(([p, count]) => (
          <MetricCard key={p} title={`Issues prioridad ${p}`} value={count} />
        ))}
      </section>

      <div className="flex flex-wrap sm:flex-nowrap w-full gap-4">
        <section className="bg-background p-4 rounded flex flex-col gap-2 w-full">
          <h2 className="text-lg font-semibold">Alertas de Issues</h2>
          {metrics.issuesAlert.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay issues críticos próximamente.</p>
          ) : (
            <ul className="flex flex-col gap-1 max-h-100 overflow-y-auto">
              {metrics.issuesAlert
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .map(issue => (
                  <li key={issue.id} className={`p-2 rounded bg-surface flex items-center ${issue.colorClass}`}>
                    {issue.icon}
                    <div>
                      <p className="font-medium">{issue.summary}</p>
                      <p className="text-xs">
                        Vence: {issue.dueDate.toLocaleDateString()} | Estado: {issue.status}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <article className="bg-background p-4 rounded flex flex-col gap-4 w-full sm:w-[500px] min-h-[400px]">
          <h2 className="text-lg font-semibold mb-2">Distribución de Issues por Estado</h2>
          {totalIssues === 0 ? (
            <p className="text-sm text-muted-foreground">No hay issues disponibles.</p>
          ) : (
            <ResponsiveContainer width="100%" >
              <PieChart>
                <Pie
                  data={ISSUE_STATES.map(state => ({
                    name: state,
                    value: metrics.issuesByState[state] || 0,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  labelLine={false}
                >
                  {ISSUE_STATES.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend wrapperStyle={{ fontSize: '12px' }} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </article>
      </div>

      <section className="bg-background p-4 rounded flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Progreso (%) de Issues por Proyecto</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={progressByProject} margin={{ bottom: 60, left: 10, right: 10 }}>
            <XAxis dataKey="project" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} unit="%" />
            <Tooltip formatter={(value) => [`${value}%`, 'Avance']} />
            <Bar dataKey="progress">
              {progressByProject.map((entry, index) => {
                let fill = '#ef4444' 
                if (entry.progress >= 80) fill = '#10b981'
                else if (entry.progress >= 50) fill = '#f59e0b' 
                return <Cell key={`cell-${index}`} fill={fill} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-background p-4 rounded flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Progreso (%) de Issues por Épica</h2>
        {metrics.epicProgress.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay épicas con issues.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {(() => {
              const epicData = metrics.epicProgress.map(epic => {
                const total = epic.issuesByState.reduce((sum, s) => sum + s.value, 0)
                const completed = epic.issuesByState.find(s => s.name === 'Actividad completada')?.value || 0
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0

                let fill = '#ef4444'
                if (progress >= 80) fill = '#10b981' 
                else if (progress >= 50) fill = '#f59e0b'

                return { name: epic.name, progress, fill }
              })

              return (
                <BarChart data={epicData} margin={{ bottom: 60, left: 10, right: 10 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Avance']} />
                  <Bar dataKey="progress">
                    {epicData.map(epic => (
                      <Cell key={epic.name} fill={epic.fill} />
                    ))}
                  </Bar>
                </BarChart>
              )
            })()}
          </ResponsiveContainer>
        )}
      </section>
    </div>
  )
}
