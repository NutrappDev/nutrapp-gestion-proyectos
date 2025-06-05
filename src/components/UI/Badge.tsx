import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';

interface BadgeProps {
  color?: keyof Theme['colors'] | string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  children: React.ReactNode;
}

const getBackgroundColor = (
  color: string | undefined, 
  variant: string, 
  theme: Theme
) => {
  if (variant === 'outlined') return 'transparent';
  if (color && theme.colors[color as keyof Theme['colors']]) {
    return theme.colors[color as keyof Theme['colors']];
  }
  return color || theme.colors.primary;
};

const getTextColor = (
  color: string | undefined, 
  variant: string, 
  theme: Theme
) => {
  if (variant === 'outlined') {
    if (color && theme.colors[color as keyof Theme['colors']]) {
      return theme.colors[color as keyof Theme['colors']];
    }
    return color || theme.colors.primary;
  }
  return '#fff';
};

const BadgeContainer = styled.span<Omit<BadgeProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: ${({ size }) => (size === 'small' ? '2px 8px' : '4px 12px')};
  font-size: ${({ size }) => (size === 'small' ? '0.75rem' : '0.875rem')};
  font-weight: 500;
  line-height: 1.5;
  background-color: ${({ color, variant, theme }) => 
    getBackgroundColor(color || '', variant || 'filled', theme)};
  color: ${({ color, variant, theme }) => 
    getTextColor(color || '', variant || 'filled', theme)};
  border: ${({ variant, color, theme }) => 
    variant === 'outlined' ? `1px solid ${color || theme.colors.primary}` : 'none'};
`;

export const Badge = ({ 
  color, 
  variant = 'filled', 
  size = 'medium', 
  children 
}: BadgeProps) => {
  return (
    <BadgeContainer 
      color={color} 
      variant={variant} 
      size={size}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </BadgeContainer>
  );
};