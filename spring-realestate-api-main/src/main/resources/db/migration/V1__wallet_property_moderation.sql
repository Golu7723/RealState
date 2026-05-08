CREATE TABLE IF NOT EXISTS wallets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    wallet_id BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    credit BIT NOT NULL,
    reference_id VARCHAR(255) NULL,
    description VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_tx_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);

CREATE TABLE IF NOT EXISTS property_facilities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    facility_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_property_facilities_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT uk_property_facility UNIQUE (property_id, facility_type)
);

CREATE TABLE IF NOT EXISTS property_approvals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    action_by INT NULL,
    remarks VARCHAR(500) NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_approval_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_property_approval_action_by FOREIGN KEY (action_by) REFERENCES users(id)
);
