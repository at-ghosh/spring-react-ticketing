import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  Input,
  HStack,
  Grid,
  GridItem,
  Badge,
} from '@chakra-ui/react';
import { User, Mail } from 'lucide-react';
import { userService } from '../services/api';
import type { User as UserType } from '../types';

const UsersPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserType) => {
    console.log('Edit user:', user);
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      setError(null);
      console.log('Updating user status for user ID:', userId);
      
      const userToUpdate = users.find(u => u.id === userId);
      if (userToUpdate) {
        const updatedUser: UserType = {
          ...userToUpdate,
          status: userToUpdate.status === 'active' ? 'inactive' : 'active'
        };
        
        console.log('Sending update request:', updatedUser);
        const response = await userService.updateUser(userId, updatedUser);
        console.log('User updated successfully:', response.data);
        
        setUsers(prev => prev.map(user => 
          user.id === userId ? response.data : user
        ));
      } else {
        throw new Error('User not found');
      }
    } catch (err: unknown) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'agent': return 'blue';
      case 'reporter': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">Users</Text>
          <Text color="gray.600">Manage system users and their roles</Text>
        </Box>
        <Button colorScheme="blue">
          Add User
        </Button>
      </Flex>

      {error && (
        <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={4} mb={4}>
          <Text color="red.800">{error}</Text>
        </Box>
      )}

      <HStack gap={4} mb={6}>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {filteredUsers.map((user) => (
          <GridItem key={user.id}>
            <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200" p={6}>
              <Flex align="center" mb={4}>
                <Box bg="blue.100" borderRadius="full" p={2} mr={3}>
                  <User size={20} color="#3182ce" />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="medium" fontSize="lg">{user.name || 'Unknown User'}</Text>
                  <Flex align="center" mt={1}>
                    <Mail size={12} color="#718096" />
                    <Text fontSize="sm" color="gray.500" ml={1}>{user.email}</Text>
                  </Flex>
                </Box>
              </Flex>

              <HStack gap={2} mb={4}>
                <Badge colorScheme={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
                <Badge colorScheme={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </HStack>

              <HStack gap={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme={user.status === 'active' ? 'red' : 'green'}
                  onClick={() => handleDeactivateUser(user.id)}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </HStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {filteredUsers.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="gray.500">No users found</Text>
          <Text color="gray.400">Try adjusting your search criteria</Text>
        </Box>
      )}
    </Box>
  );
};

export default UsersPage;