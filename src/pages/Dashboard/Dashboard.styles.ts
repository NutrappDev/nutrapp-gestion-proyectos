import styled from '@emotion/styled';
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