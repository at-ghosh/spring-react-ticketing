package com.example.springbootapp.repository;

import com.example.springbootapp.entity.Ticket;
import com.example.springbootapp.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByAgentIdAndStatus(Long agentId, TicketStatus status);
    List<Ticket> findByStatus(TicketStatus status);
}
