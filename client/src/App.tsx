import { ChakraProvider, Box, createSystem, defaultConfig } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import UsersPage from './pages/UsersPage';

const system = createSystem(defaultConfig);

function App() {
  return (
    <ChakraProvider value={system}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
