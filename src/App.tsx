import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { FiltersProvider } from './context/FiltersContext';
import { NotFound } from './pages/NotFound';
import './styles/global.scss';
import { MantineProvider } from '@mantine/core';

function App() {
  const queryClient = new QueryClient();

  return (
    <MantineProvider >
      <QueryClientProvider client={queryClient}>
      <FiltersProvider>
        <BrowserRouter basename="/nutrapp-gestion-proyectos">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FiltersProvider>
    </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
