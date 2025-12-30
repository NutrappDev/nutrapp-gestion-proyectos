import { useEffect, useState } from 'react';
import { UptimeRobotMonitor } from '@/types/uptimerobot';
import { getUptimeRobotMonitoring } from '@/lib/uptimeRobotApi';

interface UseUptimeRobotProps {
  viewMonitoring?: boolean;
}

export const useUptimeRobot = ({
  viewMonitoring = false,
}: UseUptimeRobotProps) => {
  const [monitoring, setMonitoring] = useState<UptimeRobotMonitor[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitoring = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUptimeRobotMonitoring();
      setMonitoring(response.monitors);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener monitoreo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMonitoring) {
      fetchMonitoring();
    }
  }, [viewMonitoring]);

  return {
    monitoring,
    isLoading,
    error,
    refetch: fetchMonitoring,
  };
};
