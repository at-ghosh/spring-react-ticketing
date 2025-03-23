package com.example.springbootapp.service;

import com.example.springbootapp.entity.User;
import com.example.springbootapp.entity.TicketStatus;
import com.example.springbootapp.entity.UserRole;
import com.example.springbootapp.repository.UserRepository;
import com.example.springbootapp.repository.TicketRepository;
import org.springframework.stereotype.Service;
import java.util.Comparator;

@Service
public class AgentAssignmentService {
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    
    public AgentAssignmentService(UserRepository userRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }
    
    public User findLeastBusyAgent() {
        return userRepository.findByRole(UserRole.AGENT).stream()
            .min(Comparator.comparingLong(agent -> 
                ticketRepository.countByAgentIdAndStatus(agent.getId(), TicketStatus.OPEN)))
            .orElseThrow(() -> new RuntimeException("No agents available"));
    }
}
