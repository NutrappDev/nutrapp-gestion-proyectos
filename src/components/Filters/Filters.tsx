import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import CustomSelectField from './CustomSelectField';
import { useFiltersContext } from '@/context/FiltersContext';
import { TEAMS, ALL_ASSIGNEES } from '@/constants/team'; 
import { useMemo } from 'react';

const FiltersContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  border-radius: 24px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: end;
  gap: 8px;
`;

const FiltersContents = styled.div`
  display: flex;
  gap: 16px;
`;

interface FiltersProps {
  projects: string[];
  assignees: string[];
}

export const Filters = ({ 
  projects = []
}: FiltersProps) => {
  const { filters: currentFilters, updateFilter, resetFilters, getSelectedTeamMembers } = useFiltersContext();
  
  const assigneeOptions = useMemo(() => {
    const selectedTeamMembers = getSelectedTeamMembers();
    if (selectedTeamMembers) {
      return selectedTeamMembers.sort().map((assignee) => ({ value: assignee.toUpperCase(), label: assignee }));
    } else {
      return ALL_ASSIGNEES.map((assignee) => ({ value: assignee.toUpperCase(), label: assignee }));
    }
  }, [currentFilters.teamId, getSelectedTeamMembers]);

  return (
    <FiltersContainer>
      <FiltersContents>
        <CustomSelectField
          label="Equipo"
          value={currentFilters.teamId || ''}
          onChange={(e) => {
            updateFilter('teamId', e.target.value);
            updateFilter('assignee', undefined); 
          }}
          InputLabelProps={{
            shrink: false,
            style: currentFilters.teamId
              ? { display: 'none' }
              : undefined
          }}
          options={[
            { value: '', label: 'Todos los equipos' },
            ...TEAMS.map((team) => ({ value: team.id, label: team.label })),
          ]}
        />
        <CustomSelectField
          label="Proyecto"
          value={currentFilters.project || ''}
          onChange={(e) => updateFilter('project', e.target.value)}
          InputLabelProps={{
            shrink: false,
            style: currentFilters.project
              ? { display: 'none' }
              : undefined
          }}
          options={[
            { value: '', label: 'Todos los proyectos' },
            ...projects.map((project) => ({ value: project, label: project })),
          ]}
        />

      <CustomSelectField
        label="Asignado"
        value={currentFilters.assignee?.toUpperCase() || ''}
        onChange={(e) => {
          updateFilter('assignee', e.target.value)
          // const team = findTeamByAssignee(e.target.value || '');
          // updateFilter('teamId', team ? team.id : undefined);
        }}
        InputLabelProps={{
          shrink: false,
          style: currentFilters.assignee
            ? { display: 'none' }
            : undefined
        }}
        options={[
          { value: '', label: 'Todos los asignados' },
          ...assigneeOptions,
        ]}
      />

      </FiltersContents>
      <Button
        variant="outlined"
        onClick={resetFilters}
        endIcon={<RestartAlt fontSize="small"/>}
        sx={{ 
          height: 40,
          border: 'none',
          color: '#ffffff',
          fontSize: 12,
          background: `linear-gradient(to left, #3C2052, #4a3873)`,
          borderRadius: '24px',
          '&:hover': {
            borderColor: '#ffffff'
          }
        }}
      >
        Limpiar
        
      </Button>
    </FiltersContainer>
  );
};
