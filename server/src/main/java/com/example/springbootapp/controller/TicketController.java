package com.example.springbootapp.controller;

import com.example.springbootapp.entity.Ticket;
import com.example.springbootapp.entity.TicketStatus;
import com.example.springbootapp.repository.TicketRepository;
import com.example.springbootapp.service.TicketService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {
    private final TicketService ticketService;
    private final TicketRepository ticketRepository;

    public TicketController(TicketService ticketService, TicketRepository ticketRepository) {
        this.ticketService = ticketService;
        this.ticketRepository = ticketRepository;
    }

    @PostMapping
    public Ticket createTicket(@RequestBody TicketService.TicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus newStatus) {
        return ticketService.updateTicketStatus(id, newStatus);
    }

    @GetMapping("/dashboard")
    public TicketService.DashboardAnalytics getDashboardAnalytics() {
        return ticketService.getDashboardAnalytics();
    }
}
