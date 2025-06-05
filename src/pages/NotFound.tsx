import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #172b4d;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #5e6c84;
  max-width: 600px;
`;

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>404 - Página no encontrada</Title>
      <Message>
        La página que estás buscando no existe o ha sido movida.
      </Message>
      <Button 
        onClick={() => navigate('/')}
        aria-label="Volver al inicio"
      >
        Volver al Dashboard
      </Button>
    </Container>
  );
};