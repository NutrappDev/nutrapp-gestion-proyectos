import { useState } from 'react';

export const useDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return {
    activeTab,
    handleTabChange,
  };
}; 