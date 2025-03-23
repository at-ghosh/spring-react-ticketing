import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { X } from 'lucide-react';
import { ticketService } from '../services/api';
import type { CreateTicketData } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) => {
  const [formData, setFormData] = useState<CreateTicketData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    type: 'BUG',
    reporterId: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await ticketService.createTicket(formData);
      onTicketCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        type: 'BUG',
        reporterId: 1,
      });
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setError('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW="500px"
        w="90%"
        maxH="90vh"
        overflow="auto"
        p={6}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="xl" fontWeight="bold">Create New Ticket</Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            p={1}
          >
            <X size={20} />
          </Button>
        </Flex>

        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={4} mb={4}>
            <Text color="red.800">{error}</Text>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">Title</Text>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter ticket title"
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Description</Text>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter ticket description"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </Box>

            <HStack gap={4}>
              <Box flex={1}>
                <Text mb={2} fontWeight="medium">Priority</Text>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priority: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW'
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    fontSize: '16px'
                  }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </Box>

              <Box flex={1}>
                <Text mb={2} fontWeight="medium">Type</Text>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    type: e.target.value as 'BUG' | 'FEATURE' | 'SUPPORT' | 'MAINTENANCE'
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    fontSize: '16px'
                  }}
                >
                  <option value="BUG">Bug</option>
                  <option value="FEATURE">Feature</option>
                  <option value="SUPPORT">Support</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </Box>
            </HStack>

            <HStack gap={3} justify="flex-end" pt={4}>
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTicketModal;