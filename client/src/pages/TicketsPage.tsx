import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Badge,
  Spinner,
  Input,
  HStack,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Plus, User, Calendar, Clock } from 'lucide-react';
import { ticketService } from '../services/api';
import type { Ticket } from '../types';
import CreateTicketModal from '../components/CreateTicketModal';

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (err) {
      console.error('Fetch tickets error:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      setError(null);
      const response = await ticketService.updateTicketStatus(ticketId, newStatus);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? response.data : ticket
      ));
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      setError('Failed to update ticket status');
    }
  };

  const handleTicketCreated = () => {
    fetchTickets();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'red';
      case 'IN_PROGRESS': return 'yellow';
      case 'RESOLVED': return 'green';
      case 'CLOSED': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUG': return 'red';
      case 'FEATURE': return 'blue';
      case 'SUPPORT': return 'purple';
      case 'MAINTENANCE': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.reporter.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" h="64">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">Tickets</Text>
          <Text color="gray.600">Manage support tickets and track progress</Text>
        </Box>
        <Button 
          colorScheme="blue" 
          onClick={() => setIsModalOpen(true)}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Plus size={16} />
          Create Ticket
        </Button>
      </Flex>

      {error && (
        <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={4} mb={4}>
          <Text color="red.800">{error}</Text>
        </Box>
      )}

      <HStack gap={4} mb={6}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            maxWidth: '200px'
          }}
        >
          <option value="all">All Tickets</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <Input
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
      </HStack>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {filteredTickets.map((ticket) => (
          <GridItem key={ticket.id}>
            <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    #{ticket.id} - {ticket.title}
                  </Text>
                  <HStack gap={2} mb={3}>
                    <Badge colorScheme={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge colorScheme={getTypeColor(ticket.type)}>
                      {ticket.type}
                    </Badge>
                    <Badge colorScheme={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </HStack>
                </Box>
              </Flex>

              <VStack align="start" gap={2} mb={4}>
                <Flex align="center" gap={2}>
                  <User size={16} color="#718096" />
                  <Text fontSize="sm" color="gray.600">
                    Reporter: {ticket.reporter.name}
                  </Text>
                </Flex>
                {ticket.agent && (
                  <Flex align="center" gap={2}>
                    <User size={16} color="#718096" />
                    <Text fontSize="sm" color="gray.600">
                      Agent: {ticket.agent.name}
                    </Text>
                  </Flex>
                )}
                <Flex align="center" gap={2}>
                  <Calendar size={16} color="#718096" />
                  <Text fontSize="sm" color="gray.600">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Clock size={16} color="#718096" />
                  <Text fontSize="sm" color="gray.600">
                    Due: {new Date(ticket.dueBy).toLocaleDateString()}
                  </Text>
                </Flex>
              </VStack>

              <HStack gap={2}>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <Button size="sm" variant="ghost" colorScheme="blue">
                  View Details
                </Button>
              </HStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {filteredTickets.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="gray.500">No tickets found</Text>
          <Text color="gray.400">Try adjusting your search criteria or create a new ticket</Text>
        </Box>
      )}

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </Box>
  );
};

export default TicketsPage;