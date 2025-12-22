import { useNavigate } from 'react-router-dom';
import { Button } from '@components/UI/Button';
import { Box, Center, Stack, Text, Title as MantineTitle } from '@mantine/core';
import styles from './NotFound.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles['notfound-bg']} style={{ minHeight: '100vh', width: '100vw' }}>
      <Center style={{ height: '100vh' }}>
        <Stack align="center" >
          <p className={styles['notfound-404']}>404</p>
          <MantineTitle order={1} className={styles['notfound-title']}>Opps! Página no encontrada</MantineTitle>
          <Text unstyled className={styles['notfound-message']}>
            La página que estás buscando no existe o ha sido movida.
          </Text>
          <Button 
            onClick={() => navigate('/')}
            aria-label="Volver al inicio"
            variant="gradient"
            gradient={{ from: 'rgba(59, 39, 125, 1)', to: '#6a408c', deg: 90 }}
          >
            Volver al Dashboard
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};