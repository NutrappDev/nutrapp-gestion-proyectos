export type UptimeRobotMonitoringResponse = {
  success: boolean;
  monitors: UptimeRobotMonitor[];
};

export type UptimeRobotMonitor = {
  id: number;
  name: string;
  tag: string;
  url: string;
  last24h: UptimeRobotLast24h;
  status: UptimeRobotStatus;
  avgResponseTime: string;
  responseTimes: UptimeRobotResponseTime[];
};

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
