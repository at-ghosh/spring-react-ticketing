import { type ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  Badge,
} from '@chakra-ui/react';
import { Home, Ticket, Users, BarChart3, Settings, Menu, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  path: string;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, path, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path} onClick={onClick}>
      <Button
        variant={isActive ? "solid" : "ghost"}
        colorScheme={isActive ? "blue" : "gray"}
        justifyContent="flex-start"
        w="full"
        gap={2}
      >
        <Icon size={18} />
        {label}
      </Button>
    </Link>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Ticket, label: 'Tickets', path: '/tickets' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const SidebarContent = () => (
    <VStack gap={2} align="stretch" p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.600">
        Ticket System
      </Text>
      {menuItems.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
        />
      ))}
    </VStack>
  );

  return (
    <Flex h="100vh">
      {/* Desktop Sidebar */}
      <Box
        w="64"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        display={{ base: 'none', lg: 'block' }}
      >
        <SidebarContent />
      </Box>

      {/* Main Content */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px={6}
          py={4}
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
        >
          <HStack gap={4}>
            <Button
              variant="ghost"
              display={{ base: 'flex', lg: 'none' }}
              size="sm"
            >
              <Menu size={20} />
            </Button>
            <Text fontSize="xl" fontWeight="semibold">
              Ticket Management System
            </Text>
          </HStack>

          <HStack gap={4}>
            <Box maxW="sm" display={{ base: 'none', md: 'block' }}>
              <Input placeholder="Search tickets..." />
            </Box>

            <Box position="relative">
              <Button variant="ghost" size="sm">
                <Bell size={20} />
              </Button>
              <Badge
                colorScheme="red"
                position="absolute"
                top="-1"
                right="-1"
                fontSize="xs"
                borderRadius="full"
              >
                3
              </Badge>
            </Box>

            <Button variant="ghost" size="sm" borderRadius="full">
              <User size={20} />
            </Button>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box flex={1} overflow="auto" p={6}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;