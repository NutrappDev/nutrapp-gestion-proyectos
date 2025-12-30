import { UptimeRobotMonitor } from "@/types/uptimerobot";
import { IconCloudOff } from "@tabler/icons-react";

interface CardProps {
  name: string;
  avatarUrls?: string;
  projectTypeKey?: string;
  simplified?: boolean;
  onClick?: () => void;
  isSelected: boolean;
  monitors?: {
    dev?: UptimeRobotMonitor;
    qa?: UptimeRobotMonitor;
  };
  timeFilter: string;
  statusFilter: string;
}

export default function CardProjects({
  name,
  isSelected,
  onClick,
  monitors = {},
  timeFilter,
  statusFilter,
}: CardProps) {

  const hoursDay = (() => {
    switch (timeFilter) {
      case "24h":
        return Array.from({ length: 24 }, (_, i) => i + 1);
      case "48h":
        return Array.from({ length: 48 }, (_, i) => i + 1);
      case "7d":
        return Array.from({ length: 7 }, (_, i) => i + 1);
      case "30d":
        return Array.from({ length: 30 }, (_, i) => i + 1);
      default:
        return Array.from({ length: 24 }, (_, i) => i + 1);
    }
  })();

  const getFilteredMonitor = (monitor?: UptimeRobotMonitor) => {
    if (!monitor) return undefined;
    if (statusFilter !== "all" && monitor.status !== statusFilter) return undefined;

    const lastPeriod = monitor.stats?.[timeFilter] || monitor.stats?.["24h"];
    if (!lastPeriod) return undefined;

    return { ...monitor, lastPeriod };
  };


  const renderBars = (monitor?: UptimeRobotMonitor) => {
    const filtered = getFilteredMonitor(monitor);
    if (!filtered) return null;

    const uptime = filtered.uptime?.[timeFilter] ?? "--";
    const incidents = filtered.lastPeriod?.incidents ?? 0;
    const details = filtered.lastPeriod?.details ?? [];


    const failedUnits = details.map(d => {
      const date = new Date(d.start);
      switch (timeFilter) {
        case "24h": return date.getHours();
        case "48h": return date.getHours() + (date.getDate() % 2) * 24;
        case "7d": return date.getDay();
        case "30d": return date.getDate() - 1;
        default: return date.getHours();
      }
    });

    return (
      <div className="flex flex-col gap-1 flex-1 w-full">
        <p className="text-xs opacity-60">
          {uptime} · {incidents} incidents
        </p>
        <div className="flex gap-[2px] overflow-hidden w-full">
          {hoursDay.map((unit) => {
            const isFailed = failedUnits.includes(unit);
            const barColor = isFailed ? "bg-red-400" :
              filtered.status === "UP" ? "bg-emerald-400" : "bg-muted";

            return (
              <div
                key={`${filtered.name}-${unit}`}
                className={`flex-1 h-[3rem] rounded-sm ${barColor}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const MonitorRow = ({ label, monitor }: { label: string; monitor?: UptimeRobotMonitor }) => (
    <div className="flex flex-col items-center gap-2 bg-background p-2 rounded-md w-full">
      <span className="w-10 text-xs sm:text-sm font-medium opacity-70">{label}</span>
      {renderBars(monitor) || (
        <div className="flex flex-col items-center gap-1">
          <span>Monitores {label} no disponibles</span>
          <IconCloudOff />
        </div>
      )}
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={`bg-surface border rounded-lg p-3 w-full items-center sm:p-4 sm:min-w-[30%] flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${isSelected
        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
        : "border-border"
        }`}
    >
      <div className="px-2 text-center w-full overflow-hidden">
        <p className="text-sm sm:text-base font-medium truncate">{name}</p>
      </div>


      <MonitorRow label="Dev" monitor={monitors.dev} />
      <MonitorRow label="QA" monitor={monitors.qa} />
    </div>
  );
}
