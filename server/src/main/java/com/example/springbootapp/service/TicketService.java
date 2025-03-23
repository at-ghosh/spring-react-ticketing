package com.example.springbootapp.service;

import com.example.springbootapp.entity.*;
import com.example.springbootapp.repository.TicketRepository;
import com.example.springbootapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AgentAssignmentService agentAssignmentService;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, AgentAssignmentService agentAssignmentService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.agentAssignmentService = agentAssignmentService;
    }

    public static class TicketDTO {
        private TicketType type;
        private String title;
        private Priority priority;
        private Long reporterId;

        public TicketType getType() { return type; }
        public void setType(TicketType type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }
        public Long getReporterId() { return reporterId; }
        public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
    }

    public static class DashboardAnalytics {
        private long totalTickets;
        private long openTickets;
        private long closedTickets;
        private double averageResolutionTimeHours;

        public long getTotalTickets() { return totalTickets; }
        public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
        public long getOpenTickets() { return openTickets; }
        public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
        public long getClosedTickets() { return closedTickets; }
        public void setClosedTickets(long closedTickets) { this.closedTickets = closedTickets; }
        public double getAverageResolutionTimeHours() { return averageResolutionTimeHours; }
        public void setAverageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; }
    }

    public Ticket createTicket(TicketDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setType(dto.getType());
        ticket.setTitle(dto.getTitle());
        ticket.setPriority(dto.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        
        // Set reporter
        User reporter = userRepository.findById(dto.getReporterId())
            .orElseThrow(() -> new RuntimeException("Reporter not found"));
        ticket.setReporter(reporter);
        
        // Set due by based on priority
        LocalDateTime dueBy = LocalDateTime.now().plusHours(
            switch (dto.getPriority()) {
                case HIGH -> 24;
                case MEDIUM -> 48;
                case LOW -> 72;
            }
        );
        ticket.setDueBy(dueBy);
        
        // Auto-assign to least busy agent
        ticket.setAgent(agentAssignmentService.findLeastBusyAgent());
        
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long id, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
            
        ticket.setStatus(newStatus);
        
        if (newStatus == TicketStatus.CLOSED) {
            LocalDateTime closedAt = LocalDateTime.now();
            ticket.setClosedAt(closedAt);
            ticket.setSlaMet(closedAt.isBefore(ticket.getDueBy()));
        }
        
        return ticketRepository.save(ticket);
    }

    public DashboardAnalytics getDashboardAnalytics() {
        List<Ticket> allTickets = ticketRepository.findAll();
        List<Ticket> closedTickets = allTickets.stream()
            .filter(t -> t.getStatus() == TicketStatus.CLOSED)
            .toList();
            
        double avgResolutionHours = closedTickets.stream()
            .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getClosedAt()).toHours())
            .average()
            .orElse(0.0);
            
        DashboardAnalytics analytics = new DashboardAnalytics();
        analytics.setTotalTickets(allTickets.size());
        analytics.setOpenTickets(ticketRepository.findByStatus(TicketStatus.OPEN).size());
        analytics.setClosedTickets(closedTickets.size());
        analytics.setAverageResolutionTimeHours(avgResolutionHours);
        
        return analytics;
    }
}
