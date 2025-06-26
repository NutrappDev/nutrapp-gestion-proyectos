import React from 'react';
import { Select, rem } from '@mantine/core';

type SimpleSelectOption = { value: string; label: string; [key: string]: any };
interface GroupedSelectOption {
  group: string;
  items: SimpleSelectOption[];
}

interface CustomSelectFieldProps {
  label?: React.ReactNode;
  placeholder?: string;
  value: string | null;
  data: (SimpleSelectOption | GroupedSelectOption | string)[];
  onChange: (value: string | null) => void;
  hideLabel?: boolean;
  isSearcheable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  label,
  placeholder,
  value,
  data,
  onChange,
  hideLabel = false,
  isSearcheable = false,
  disabled = false,
  readOnly = false,
  ...props
}) => {
  // const [dropdownOpened, setDropdownOpened] = useState(false);

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data as any}
      value={value}
      onChange={onChange}
      clearable 
      searchable={isSearcheable}
      radius="xl"
      size="sm"
      disabled={disabled}
      readOnly={readOnly}
      checkIconPosition="right"
      // rightSection={
      //   <IconChevronDown
      //     style={{
      //       width: rem(18),
      //       height: rem(18),
      //       transform: dropdownOpened ? 'rotate(180deg)' : 'rotate(0deg)',
      //       transition: 'transform 200ms ease',
      //       pointerEvents: 'none', 
      //       color: '#3C2052',
      //     }}
      //     stroke={1.5}
      //   />
      // }
      // rightSectionPointerEvents={value !== null && !disabled && !readOnly ? 'all' : 'none'}
      // rightSectionWidth={rem(36)}
      // onDropdownOpen={() => setDropdownOpened(true)}
      // onDropdownClose={() => setDropdownOpened(false)}

      comboboxProps={{
        shadow: 'md',
        transitionProps: { transition: 'pop', duration: 200 },
        styles: {
          dropdown: {
            zIndex: 1300,
            maxHeight: rem(250),
            paddingTop: rem(4),
            overflowY: 'auto',
            gap: rem(8),
            backgroundColor: '#ffffff',
            boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.05), -2px -3px 4px rgba(0, 0, 0, 0.05)',
            marginTop: rem(4),
            padding: rem(8),
            borderRadius: rem(8),

            '&::-webkit-scrollbar': {
              width: rem(10),
              height: rem(8),
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#3C2052',
              borderRadius: rem(10),
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          },
        },
      }}
      styles={(theme) => ({
        input: {
          minWidth: rem(125),
          borderColor: '#9379a7',
          borderWidth: rem(1),
          color: '#3C2052',
          background: `linear-gradient(to right, #ece9f3, #ffffff)`,
          '&::placeholder': {
            color: '#3C2052',
            opacity: 1,
          },
          '&:hover': {
            borderColor: '#9379a7',
            borderWidth: rem(1),
          },
          '&:focus-within': {
            borderColor: '#9379a7',
            borderWidth: rem(1),
          },
        },
        rightSection: {
          color: '#3C2052',
        },
        label: {
          fontSize: rem(14),
          textAlign: 'start',
          color: '#3C2052',
          display: hideLabel ? 'none' : undefined,
        },
        option: {
          fontSize: rem(14),
          minHeight: 'auto',
          paddingTop: rem(6),
          paddingBottom: rem(6),
          borderRadius: rem(24),
          margin: `${rem(4)} 0`,
          color: theme.colors.dark[9],
          position: 'relative', 
          '&[data-hovered]': {
            backgroundColor: '#3C2052',
            color: theme.colors.dark[9],
          },
          '&[data-selected]': {
            backgroundColor: '#D3D2E3',
            color: '#3C2052', 
            paddingRight: rem(32),
          },
          '&[data-selected][data-hovered]': {
            backgroundColor: '#C2C1D2',
          },

          '& .mantine-Select-checkIcon': { 
            position: 'absolute',
            right: rem(12),
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#3C2052', 
          },
        },
        groupLabel: {
          color: '#3C2052',
          fontWeight: 'bold',
          paddingLeft: rem(16),
        },
      })}
      {...props}
    />
  );
};

export default CustomSelectField;