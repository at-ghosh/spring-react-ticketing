package com.example.springbootapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TicketType type;
    
    private String title;
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;
    
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;
    
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
    private LocalDateTime dueBy;
    private Boolean slaMet;

    public Ticket() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TicketType getType() { return type; }
    public void setType(TicketType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public LocalDateTime getDueBy() { return dueBy; }
    public void setDueBy(LocalDateTime dueBy) { this.dueBy = dueBy; }

    public Boolean getSlaMet() { return slaMet; }
    public void setSlaMet(Boolean slaMet) { this.slaMet = slaMet; }
}
