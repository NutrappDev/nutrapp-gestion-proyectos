import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import type { TabProps } from '@mui/material/Tab';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export const DashboardContainer = styled.div`
  min-width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimatedContent = styled.div`
  animation: ${fadeIn} 0.8s ease;
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  0%, 100% { border-color: transparent }
  50% { border-color: #6a408c }
`;
export const AnimatedTitle = styled.h1`
  font-weight: bold;
  background: linear-gradient(to right, #3c2052, #6a408c);
  -webkit-background-clip: text;
  color: transparent;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: 
    ${typing} 2.5s steps(30, end) forwards,
    ${blink} 1s step-end forwards;
`;

export const ColumnsContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  flex: 1;
  flex-wrap: nowrap;
  overflow: 'auto';
  padding: 0 1.5rem;
  padding-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #ff5630;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ImageContainer = styled.div`
  width: 5rem;
  height: 5rem;
`;

export const CustomTabs = styled(Tabs)({
  borderBottom: '1px solid #ddd',
  '& .MuiTabs-indicator': {
    backgroundColor: '#6C4AB6',
    height: 3,
  },
});

export const CustomTab = styled(Tab)<TabProps>(({}) => ({
  textTransform: 'none',
  minHeight: '32px',
  color: 'rgba(0, 0, 0, 0.6)',
  '&.Mui-selected': {
    color: '#6C4AB6',
  },
  '&:hover': {
    color: '#4e2e9e',
  },
})); 