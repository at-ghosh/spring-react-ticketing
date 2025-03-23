import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Ticket, Users, Clock, CheckCircle } from 'lucide-react';
import { ticketService } from '../services/api';
import type { DashboardAnalytics } from '../types';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getDashboardAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="64">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={4}>
        <Text color="red.800">{error}</Text>
      </Box>
    );
  }

  const ticketStatusData = [
    { name: 'Open', value: analytics?.openTickets || 0, color: '#3B82F6' },
    { name: 'Closed', value: analytics?.closedTickets || 0, color: '#10B981' },
    { name: 'In Progress', value: 8, color: '#F59E0B' },
    { name: 'Resolved', value: 5, color: '#8B5CF6' },
  ];

  const weeklyData = [
    { name: 'Mon', tickets: 12 },
    { name: 'Tue', tickets: 19 },
    { name: 'Wed', tickets: 15 },
    { name: 'Thu', tickets: 8 },
    { name: 'Fri', tickets: 22 },
    { name: 'Sat', tickets: 5 },
    { name: 'Sun', tickets: 3 },
  ];

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={6}>
        Dashboard
      </Text>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Total Tickets</Text>
                <Text fontSize="2xl" fontWeight="bold">{analytics?.totalTickets || 0}</Text>
                <Text fontSize="xs" color="gray.500">All time</Text>
              </Box>
              <Box color="blue.500">
                <Ticket size={24} />
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Open Tickets</Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">{analytics?.openTickets || 0}</Text>
                <Text fontSize="xs" color="gray.500">Needs attention</Text>
              </Box>
              <Box color="orange.500">
                <Clock size={24} />
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Closed Tickets</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">{analytics?.closedTickets || 0}</Text>
                <Text fontSize="xs" color="gray.500">Completed</Text>
              </Box>
              <Box color="green.500">
                <CheckCircle size={24} />
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Active Users</Text>
                <Text fontSize="2xl" fontWeight="bold">24</Text>
                <Text fontSize="xs" color="gray.500">Online now</Text>
              </Box>
              <Box color="purple.500">
                <Users size={24} />
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      {/* Charts */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Weekly Ticket Trends
            </Text>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Ticket Status Distribution
            </Text>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;