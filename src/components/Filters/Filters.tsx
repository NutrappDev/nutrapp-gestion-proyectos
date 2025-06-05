import styled from '@emotion/styled';
import { Button, TextField, MenuItem } from '@mui/material';

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

interface FiltersProps {
  projects: string[];
  assignees: string[];
  currentFilters: {
    project?: string;
    assignee?: string;
  };
  onFilterChange: (key: 'project' | 'assignee', value: string) => void;
  onReset: () => void;
}

export const Filters = ({ 
  projects = [], 
  assignees = [], 
  currentFilters = {}, 
  onFilterChange, 
  onReset 
}: FiltersProps) => {

  const isTeamDevelopmentActive = currentFilters.assignee === 'equipodesarrollo';

  return (
    <FiltersContainer>
      <TextField
        select
        label="Filtrar por proyecto"
        value={currentFilters.project || ''}
        onChange={(e) => onFilterChange('project', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ 
          minWidth: 200,
          backgroundColor: '#fff'
        }}
      >
        <MenuItem value="">Todos los proyectos</MenuItem>
        {projects.map((project) => (
          <MenuItem key={project} value={project}>
            {project}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Filtrar por asignado"
        value={currentFilters.assignee || ''}
        onChange={(e) => onFilterChange('assignee', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ 
          minWidth: 200,
          backgroundColor: '#fff'
        }}
      >
        <MenuItem value="">Todos los asignados</MenuItem>
        {assignees.map((assignee) => (
          <MenuItem key={assignee} value={assignee}>
            {assignee}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="outlined"
        onClick={() => onFilterChange('assignee', 'equipodesarrollo')}
        sx={{ 
          height: 40,
          borderColor: isTeamDevelopmentActive ? '#8a2be2' : '#0052cc',
          borderWidth: 1,
          color: isTeamDevelopmentActive ? '#8a2be2' : '#0052cc',
          backgroundColor: isTeamDevelopmentActive ? '#f5f0ff' : 'transparent',
          '&:hover': {
            borderColor: isTeamDevelopmentActive ? '#8a2be2' : '#0052cc'
          }
        }}
      >
        Ver equipo de desarrollo
      </Button>

      <Button
        variant="outlined"
        onClick={onReset}
        sx={{ 
          height: 40,
          borderColor: '#0052cc',
          color: '#0052cc',
          '&:hover': {
            borderColor: '#0052cc'
          }
        }}
      >
        Limpiar filtros
      </Button>
    </FiltersContainer>
  );
};
