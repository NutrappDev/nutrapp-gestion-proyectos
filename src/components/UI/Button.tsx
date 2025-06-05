import styled from '@emotion/styled';
import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
  /**
   * Si es true, muestra un indicador de carga
   */
  loading?: boolean;
}

const StyledButton = styled(MuiButton)<{ loading?: boolean }>`
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  ${({ loading }) => loading && `
    position: relative;
    color: transparent !important;
    
    &:after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      margin: -10px 0 0 -10px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;

export const Button = ({ 
  children, 
  loading = false, 
  ...props 
}: ButtonProps) => {
  return (
    <StyledButton 
      {...props} 
      loading={loading}
      disabled={loading || props.disabled}
      aria-busy={loading}
    >
      {!loading && children}
    </StyledButton>
  );
};