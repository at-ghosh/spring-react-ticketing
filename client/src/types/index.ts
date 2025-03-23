export interface User {
  id: number;
  name: string;
  email: string;
  role: 'AGENT' | 'REPORTER';
  status: 'active' | 'inactive';
}

export interface Ticket {
  id: number;
  type: 'BUG' | 'FEATURE' | 'SUPPORT' | 'MAINTENANCE';
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reporter: User;
  agent?: User;
  createdAt: string;
  closedAt?: string;
  dueBy: string;
  slaMet?: boolean;
}

export interface CreateTicketData {
  title: string;
  description?: string;
  type: 'BUG' | 'FEATURE' | 'SUPPORT' | 'MAINTENANCE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reporterId: number;
}

export interface DashboardAnalytics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  averageResolutionTimeHours: number;
}