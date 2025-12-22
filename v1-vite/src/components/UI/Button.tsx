import { Button as MantineButton } from '@mantine/core';
import type { ButtonProps as MantineButtonProps } from '@mantine/core';

interface ButtonProps extends Omit<MantineButtonProps, 'loading'> {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ 
  children, 
  loading = false, 
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <MantineButton
      radius="xl"
      {...props} 
      loading={loading}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {children}
    </MantineButton>
  );
};