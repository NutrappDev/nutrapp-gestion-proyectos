import { Button, Group, ActionIcon, Collapse, Box, useMantineTheme } from '@mantine/core';
import { IconRefresh, IconFilter } from '@tabler/icons-react';
import CustomSelectField from './CustomSelectField';
import { useFiltersContext } from '@/context/FiltersContext';
import { TEAMS, findTeamByAssignee } from '@/constants/team';
import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: 760px)`);

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

  const filtersContent = (
    <Group gap="md" justify="flex-end" >
      <CustomSelectField
        placeholder="Equipo"
        value={currentFilters.teamId || ''}
        onChange={(value) => {
          console.log("value", value)
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
          if (value) {
            const team = findTeamByAssignee(value);
            updateFilter('teamId', team ? team.id : undefined);
          }
        }}
        data={[
          { value: '', label: 'Todos los asignados' },
          ...assigneeOptions,
        ]}
      />
    </Group>
  );

  return (
    <Box
      style={{
        flex: 2,
        padding: '0.5rem',
        borderRadius: '24px',
        marginBottom: '10px',
      }}
    >
      {isMobile ? (
        // Vista móvil con filtros colapsables
        <Group gap="sm" justify="flex-end" align="center">
          <ActionIcon
            variant="light"
            size="lg"
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              backgroundColor: filtersOpen ? theme.colors.violet[1] : 'transparent',
              borderRadius: 24,
              color: filtersOpen ? theme.colors.violet[6] : theme.colors.gray[6],
              border: `1px solid ${filtersOpen ? theme.colors.violet[3] : theme.colors.gray[3]}`,
            }}
          >
            <IconFilter size={20} />
          </ActionIcon>
          
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
          
          <Collapse in={filtersOpen}>
            <Box mt="md" style={{ width: '100%' }}>
              {filtersContent}
            </Box>
          </Collapse>
        </Group>
      ) : (
        // Vista desktop normal
        <Group 
          gap="sm" 
          justify="flex-end" 
          align="flex-end"
          style={{
            flexWrap: 'wrap'
          }}
        >
          {filtersContent}
          
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
      )}
    </Box>
  );
};