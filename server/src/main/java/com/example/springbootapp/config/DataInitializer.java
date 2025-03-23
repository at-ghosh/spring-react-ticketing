package com.example.springbootapp.config;

import com.example.springbootapp.entity.*;
import com.example.springbootapp.repository.UserRepository;
import com.example.springbootapp.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public DataInitializer(UserRepository userRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        if (userRepository.count() == 0) {
            User reporter1 = new User();
            reporter1.setName("John Doe");
            reporter1.setEmail("john.doe@company.com");
            reporter1.setRole(UserRole.REPORTER);
            userRepository.save(reporter1);

            User reporter2 = new User();
            reporter2.setName("Jane Smith");
            reporter2.setEmail("jane.smith@company.com");
            reporter2.setRole(UserRole.REPORTER);
            userRepository.save(reporter2);

            User agent1 = new User();
            agent1.setName("Mike Johnson");
            agent1.setEmail("mike.johnson@company.com");
            agent1.setRole(UserRole.AGENT);
            userRepository.save(agent1);

            User agent2 = new User();
            agent2.setEmail("sarah.wilson@company.com");
            agent2.setRole(UserRole.AGENT);
            userRepository.save(agent2);

            // Create sample tickets
            createSampleTicket("Login page not loading", TicketType.BUG, Priority.HIGH, 
                              TicketStatus.OPEN, reporter1, agent1);
            
            createSampleTicket("Add dark mode feature", TicketType.FEATURE, Priority.MEDIUM, 
                              TicketStatus.IN_PROGRESS, reporter2, agent2);
            
            createSampleTicket("Password reset email not working", TicketType.BUG, Priority.HIGH, 
                              TicketStatus.RESOLVED, reporter1, agent1);
            
            createSampleTicket("Update user profile API", TicketType.MAINTENANCE, Priority.LOW, 
                              TicketStatus.OPEN, reporter2, agent1);
            
            createSampleTicket("Help with account setup", TicketType.SUPPORT, Priority.MEDIUM, 
                              TicketStatus.CLOSED, reporter1, agent2);

            System.out.println("Sample data initialized successfully!");
        }
    }

    private void createSampleTicket(String title, TicketType type, Priority priority, 
                                   TicketStatus status, User reporter, User agent) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setType(type);
        ticket.setPriority(priority);
        ticket.setStatus(status);
        ticket.setReporter(reporter);
        ticket.setAgent(agent);
        ticket.setCreatedAt(LocalDateTime.now().minusDays((long) (Math.random() * 10)));
        
        // Set due date based on priority
        LocalDateTime dueBy = ticket.getCreatedAt().plusHours(
            switch (priority) {
                case HIGH -> 24;
                case MEDIUM -> 48;
                case LOW -> 72;
            }
        );
        ticket.setDueBy(dueBy);

        // Set closed date for closed tickets
        if (status == TicketStatus.CLOSED || status == TicketStatus.RESOLVED) {
            LocalDateTime closedAt = ticket.getCreatedAt().plusHours((long) (Math.random() * 48));
            ticket.setClosedAt(closedAt);
            ticket.setSlaMet(closedAt.isBefore(dueBy));
        }

        ticketRepository.save(ticket);
    }
}