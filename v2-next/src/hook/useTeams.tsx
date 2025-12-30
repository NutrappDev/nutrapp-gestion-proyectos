'use client';

import { useEffect, useState } from "react";
import { Team, TEAMS } from "../types/team";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTeams(TEAMS);
    setIsLoading(false);
  }, []);

  return {
    teams,
    isLoading,
  };
};
