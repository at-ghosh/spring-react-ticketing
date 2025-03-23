import axios, { type AxiosResponse } from 'axios';
import type { Ticket, User, CreateTicketData, DashboardAnalytics } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ticket API calls
export const ticketService = {
  // Get all tickets
  getAllTickets: (): Promise<AxiosResponse<Ticket[]>> => 
    api.get('/tickets'),
  
  // Create a new ticket
  createTicket: (ticketData: CreateTicketData): Promise<AxiosResponse<Ticket>> => 
    api.post('/tickets', ticketData),
  
  // Update ticket status
  updateTicketStatus: (ticketId: number, status: string): Promise<AxiosResponse<Ticket>> => 
    api.put(`/tickets/${ticketId}/status?newStatus=${status}`),
  
  // Get dashboard analytics
  getDashboardAnalytics: (): Promise<AxiosResponse<DashboardAnalytics>> => 
    api.get('/tickets/dashboard'),
};

// User API calls
export const userService = {
  // Get all users
  getAllUsers: (): Promise<AxiosResponse<User[]>> => 
    api.get('/users'),
  
  // Get user by ID
  getUserById: (userId: number): Promise<AxiosResponse<User>> => 
    api.get(`/users/${userId}`),
  
  // Create a new user
  createUser: (userData: Omit<User, 'id'>): Promise<AxiosResponse<User>> => 
    api.post('/users', userData),
  
  // Update user
  updateUser: (userId: number, userData: User): Promise<AxiosResponse<User>> => 
    api.put(`/users/${userId}`, userData),
  
  // Delete user
  deleteUser: (userId: number): Promise<AxiosResponse<void>> => 
    api.delete(`/users/${userId}`),
};

export default api;