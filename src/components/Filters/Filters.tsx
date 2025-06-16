import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import CustomSelectField from './CustomSelectField';

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
          label="Proyecto"
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
        label="Asignado"
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
          ...assignees.map((assignee) => ({ value: assignee.toUpperCase(), label: assignee })),
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
