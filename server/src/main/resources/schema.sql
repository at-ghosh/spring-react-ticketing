DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    reporter_id BIGINT NOT NULL,
    agent_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    due_by TIMESTAMP NOT NULL,
    sla_met BOOLEAN DEFAULT NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Insert initial users
INSERT INTO users (name, email, role, status) VALUES 
('John Agent', 'john.agent@example.com', 'AGENT', 'active'),
('Jane Agent', 'jane.agent@example.com', 'AGENT', 'active'),
('Bob Reporter', 'bob.reporter@example.com', 'REPORTER', 'active'),
('Sarah Wilson', 'sarah.wilson@example.com', 'AGENT', 'inactive');
