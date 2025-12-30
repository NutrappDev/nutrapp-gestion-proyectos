import { UptimeRobotMonitor } from "@/types/uptimerobot"

interface CardProps {
  name: string
  avatarUrls?: string
  projectTypeKey?: string
  simplified?: boolean
  onClick?: () => void
  isSelected: boolean
  monitors?: {
    dev?: UptimeRobotMonitor
    qa?: UptimeRobotMonitor
  }
}

export default function CardProjects({
  name,
  isSelected,
  onClick,
  monitors = {},
}: CardProps) {
  const hoursDay = Array.from({ length: 24 }, (_, i) => i + 1)

  const renderBars = (monitor?: UptimeRobotMonitor) => {
    if (!monitor) return null

    const barColor =
      monitor.status === "UP"
        ? "bg-emerald-400"
        : monitor.status === "DOWN"
        ? "bg-red-400"
        : "bg-muted"

    const uptime = monitor.last24h.uptime ?? "--"
    const incidents = monitor.last24h.incidents ?? 0

    return (
      <div className="flex flex-col gap-1 flex-1 w-full">
        <p className="text-xs opacity-60">
          {uptime} · {incidents} incidents
        </p>
        <div className="flex gap-[2px] overflow-hidden w-full">
          {hoursDay.map((hour) => (
            <div
              key={`${monitor.name}-${hour}`}
              className={`w-[4px] h-[3.5rem] rounded-sm ${barColor}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={`bg-surface border rounded-lg p-3 w-full sm:p-4 sm:min-w-[30%] flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
          : "border-border"
      }`}
    >
      <div className="px-2 text-center">
        <p className="text-sm sm:text-base font-medium truncate">{name}</p>
      </div>

      {monitors.dev && (
        <div className="flex items-center gap-2 bg-background p-2 rounded-md">
          <span className="w-10 text-xs sm:text-sm font-medium opacity-70">
            Dev
          </span>
          {renderBars(monitors.dev)}
        </div>
      )}

      {monitors.qa && (
        <div className="flex items-center gap-2 bg-background p-2 rounded-md">
          <span className="w-10 text-xs sm:text-sm font-medium opacity-70">
            QA
          </span>
          {renderBars(monitors.qa)}
        </div>
      )}
    </div>
  )
}
