import { Button, Group } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import CustomSelectField from './CustomSelectField';
import { useFiltersContext } from '@/context/FiltersContext';
import { TEAMS, findTeamByAssignee } from '@/constants/team';
import { useMemo } from 'react';

interface FiltersProps {
  projects: string[];
  assignees: string[];
}

interface GroupedSelectOption {
  group: string;
  items: Array<{ value: string; label: string }>;
}

export const Filters = ({ 
  projects = []
}: FiltersProps) => {
  const { filters: currentFilters, updateFilter, resetFilters, getSelectedTeamMembers, getSelectedTeamName } = useFiltersContext();

  const formatAssigneeToItem = (assigneeName: string) => ({
    value: assigneeName.toUpperCase(),
    label: assigneeName,
  });

  const assigneeOptions = useMemo(() => {
    const options: GroupedSelectOption[] = [];
    const selectedTeamMembers = getSelectedTeamMembers();
    const selectedTeamName = getSelectedTeamName();

    if (selectedTeamMembers && selectedTeamName) {
      const teamItems = selectedTeamMembers
        .sort((a, b) => a.localeCompare(b))
        .map(formatAssigneeToItem);

      options.push({
        group: selectedTeamName,
        items: teamItems,
      });
    } else {
      TEAMS.forEach(team => {
        const teamItems = team.members
          .sort((a, b) => a.localeCompare(b))
          .map(formatAssigneeToItem);

        if (teamItems.length > 0) {
          options.push({
            group: team.label,
            items: teamItems,
          });
        }});
    }
    return options;
  }, [currentFilters.teamId, getSelectedTeamMembers, getSelectedTeamName]);

  return (
    <Group 
      gap="sm" 
      justify="flex-end" 
      align="flex-end"
      style={{
        flex: 2,
        padding: '0.5rem',
        borderRadius: '24px',
        marginBottom: '10px',
        flexWrap: 'wrap'
      }}
    >
      <Group gap="md">
        <CustomSelectField
          placeholder="Equipo"
          value={currentFilters.teamId || ''}
          onChange={(value) => {
            updateFilter('teamId', value || undefined);
            updateFilter('assignee', undefined); 
          }}
          data={[
            { value: '', label: 'Todos los equipos' },
            ...TEAMS.map((team) => ({ value: team.id, label: team.label })),
          ]}
        />
        <CustomSelectField
          placeholder="Proyecto"
          value={currentFilters.project || ''}
          onChange={(value) => updateFilter('project', value || undefined)}
          data={[
            { value: '', label: 'Todos los proyectos' },
            ...projects.map((project) => ({ value: project, label: project })),
          ]}
        />
        <CustomSelectField
          placeholder="Asignado"
          value={currentFilters.assignee?.toUpperCase() || ''}
          onChange={(value) => {
            updateFilter('assignee', value || undefined);
            const team = findTeamByAssignee(value || '');
            updateFilter('teamId', team ? team.id : undefined);
          }}
          data={[
            { value: '', label: 'Todos los asignados' },
            ...assigneeOptions,
          ]}
        />
      </Group>

      <Button
        variant="gradient"
        gradient={{ from: '#3C2052', to: '#4a3873', deg: 90 }}
        onClick={resetFilters}
        rightSection={<IconRefresh size={16} />}
        size="sm"
        radius="xl"
        styles={{
          root: {
            height: '40px',
            color: '#ffffff',
            fontSize: '12px',
            '&:hover': {
              borderColor: '#ffffff'
            }
          }
        }}
      >
        Limpiar
      </Button>
    </Group>
  );
};