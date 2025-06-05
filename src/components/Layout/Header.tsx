import styled from '@emotion/styled';
import { Button } from '../UI/Button';
import { Refresh } from '@mui/icons-material';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
}

const HeaderContainer = styled.header`
  background:rgb(52, 30, 65);
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

export const Header = ({ title, onRefresh }: HeaderProps) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <Button 
        onClick={onRefresh}
        aria-label="Refrescar datos"
        startIcon={<Refresh />}
        style={{color: '#fff'}}
      >
        Refrescar
      </Button>
    </HeaderContainer>
  );
};