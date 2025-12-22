import { Badge as MantineBadge } from '@mantine/core';

interface BadgeProps {
  color?: string;
  variant?: 'filled' | 'outlined';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Badge = ({ 
  color, 
  variant = 'filled', 
  size = 'md', 
  children 
}: BadgeProps) => {
  return (
    <MantineBadge 
      color={color}
      variant={variant}
      size={size}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </MantineBadge>
  );
};