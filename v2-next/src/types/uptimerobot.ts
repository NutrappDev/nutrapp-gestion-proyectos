export type UptimeRobotMonitoringResponse = {
  success: boolean;
  monitors: UptimeRobotMonitor[];
};


export interface UptimeRobotStats {
  "24h": UptimeRobotLast24h;
  "48h": UptimeRobotLast24h;
  "7d": UptimeRobotLast24h;
  "30d": UptimeRobotLast24h;
}

export interface UptimeRobotMonitor {
  id: number;
  name: string;
  tag: string;
  url: string;
  last24h: UptimeRobotLast24h;
  last48h?: UptimeRobotLast24h;
  last7days?: UptimeRobotLast24h;
  last30days?: UptimeRobotLast24h;
  status: UptimeRobotStatus;
  avgResponseTime: string;
  responseTimes: UptimeRobotResponseTime[];
  uptime: {          // porcentaje por rango, con 3 decimales
    "24h": string;
    "48h": string;
    "7d": string;
    "30d": string;
  };
  stats: UptimeRobotStats; // aquí van los incidentes/downtime por rango
}

export type UptimeRobotLast24h = {
  uptime: string;
  incidents: number;
  downtime: string;
};

export type UptimeRobotResponseTime = {
  datetime: number;
  value: number;
};

export type UptimeRobotStatus = 'UP' | 'DOWN';
