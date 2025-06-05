import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import type { JiraIssue } from '../types/jira';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const HoursSummaryChart = ({ issues }: { issues: JiraIssue[] }) => {
    debugger
  const data = {
    labels: ['Por hacer', 'En curso', 'Listo'],
    datasets: [
      {
        label: 'Horas por Estado',
        data: [
          issues.filter(i => i.statusCategory === 'Por hacer').reduce((sum, i) => sum + (Number(i.storyPoints) || 0), 0),
          issues.filter(i => i.statusCategory === 'En curso').reduce((sum, i) => sum + (Number(i.storyPoints) || 0), 0),
          issues.filter(i => i.statusCategory === 'Listo').reduce((sum, i) => sum + (Number(i.storyPoints) || 0), 0)
        ],
        backgroundColor: ['#919593', '#e7ba53', '#51d388']
      }
    ]
  };

  return <Bar data={data} />;
};
