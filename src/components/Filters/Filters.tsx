import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import CustomSelectField from './CustomSelectField';

const FiltersContainer = styled.div`
  display: flex;
  padding: 10px 8px;
  background: #FCF9FF;
  border: 1px solid #11182724;
  border-radius: 12px;
  margin: 16px 0;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FiltersContents = styled.div`
  display: flex;
  gap: 16px;
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


  return (
    <FiltersContainer>
      <FiltersContents>
        <CustomSelectField
          label="Filtrar por proyecto"
          value={currentFilters.project || ''}
          onChange={(e) => onFilterChange('project', e.target.value)}
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
        label="Filtrar por asignado"
        value={currentFilters.assignee?.toUpperCase() || ''}
        onChange={(e) => onFilterChange('assignee', e.target.value)}
        InputLabelProps={{
          shrink: false,
          style: currentFilters.assignee
            ? { display: 'none' }
            : undefined
        }}
        options={[
          { value: '', label: 'Todo el equipo' },
          ...assignees.map((assignee) => ({ value: assignee.toUpperCase(), label: assignee.toUpperCase() })),
        ]}
      />


      </FiltersContents>
      <Button
        variant="outlined"
        onClick={onReset}
        endIcon={<RestartAlt fontSize="small"/>}
        sx={{ 
          height: 40,
          border: 'none',
          color: '#ffffff',
          fontSize: 12,
          backgroundColor: `#362D4C`,
          borderRadius: 2,
          '&:hover': {
            borderColor: '#ffffff'
          }
        }}
      >
        Limpiar filtros
        
      </Button>
    </FiltersContainer>
  );
};
