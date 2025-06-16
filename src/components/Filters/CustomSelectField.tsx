import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface CustomOption {
  value: string;
  label: string;
}

type CustomSelectFieldProps = TextFieldProps & {
  options: CustomOption[];
};

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  options,
  ...props
}) => {
  return (
    <TextField
      select
      variant="outlined"
      size="small"
      className="rounded-md focus:outline-none focus:ring-0"
      InputLabelProps={{shrink: false}}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            style: {
              zIndex: 1300,
              maxHeight: 250,
              paddingTop: 4,
              overflowY: 'auto',
              gap: '8px',
            },
            sx: {
              backgroundColor: '#ffffff',
              boxShadow:' 3px 4px 4px rgba(0, 0, 0, 0.05), -2px -3px 4px rgba(0, 0, 0, 0.05)',
              mt: 1,
              padding: '8px',
              '&::-webkit-scrollbar': {
                width: '10px',
                height: '8px',
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#3C2052',
                borderRadius: '10px',

              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                minHeight: 'auto',
                paddingY: '6px',
                borderRadius: '24px',
                margin: '4px 0',
                '&:hover': {
                  backgroundColor: '#D3D2E3',
                },
                '&.Mui-selected': {
                  backgroundColor: '#D3D2E3',
                  '&:hover': {
                    backgroundColor: '#ffffff4d',
                  },
                },
              },
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          marginThreshold: null,
        },
      }}
      sx={{
        minWidth: 125,
        color: '#3C2052',
        '& .MuiSelect-icon': { color: '#3C2052' },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          textAlign: 'start',
          color: '#3C2052' 
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          color: '#3C2052',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#3C2052',
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: "#ffffff",
          borderRadius: '24px',
          borderWidth: '1px',
          '& fieldset': {
            borderColor: '#3C2052',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: '#3C2052',
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3C2052',
            borderWidth: '1px',
          },
        },
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomSelectField;
