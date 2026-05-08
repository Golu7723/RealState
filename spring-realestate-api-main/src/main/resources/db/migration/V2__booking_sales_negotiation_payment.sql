CREATE TABLE IF NOT EXISTS pg_units (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    booking_type VARCHAR(50) NOT NULL,
    gender_preference VARCHAR(50) NOT NULL,
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    monthly_rent DECIMAL(15,2) NOT NULL,
    security_deposit DECIMAL(15,2) NOT NULL,
    CONSTRAINT fk_pg_unit_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    customer_id INT NOT NULL,
    owner_id INT NOT NULL,
    pg_unit_id BIGINT NULL,
    booking_type VARCHAR(50) NOT NULL,
    booking_status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    monthly_rent DECIMAL(15,2) NOT NULL,
    security_deposit DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT fk_booking_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT fk_booking_pg_unit FOREIGN KEY (pg_unit_id) REFERENCES pg_units(id)
);

CREATE INDEX idx_booking_customer ON bookings(customer_id);
CREATE INDEX idx_booking_owner ON bookings(owner_id);

CREATE TABLE IF NOT EXISTS rent_payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_on DATE NULL,
    status VARCHAR(50) NOT NULL,
    reference_id VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rent_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE IF NOT EXISTS sale_inquiries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    customer_id INT NOT NULL,
    owner_id INT NOT NULL,
    offered_amount DECIMAL(15,2) NOT NULL,
    token_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sale_inquiry_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_sale_inquiry_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT fk_sale_inquiry_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS negotiation_threads (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sale_inquiry_id BIGINT NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_negotiation_thread_inquiry FOREIGN KEY (sale_inquiry_id) REFERENCES sale_inquiries(id)
);

CREATE TABLE IF NOT EXISTS negotiation_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thread_id BIGINT NOT NULL,
    sender_id INT NOT NULL,
    offer_amount DECIMAL(15,2) NOT NULL,
    message VARCHAR(500) NULL,
    accepted BIT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_negotiation_message_thread FOREIGN KEY (thread_id) REFERENCES negotiation_threads(id),
    CONSTRAINT fk_negotiation_message_sender FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS razorpay_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
    razorpay_payment_id VARCHAR(255) NULL,
    razorpay_signature VARCHAR(255) NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_razorpay_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);
