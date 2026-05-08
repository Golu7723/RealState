package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.booking.RentPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentPaymentRepository extends JpaRepository<RentPayment, Long> {
    List<RentPayment> findByBookingIdOrderByDueDateAsc(Long bookingId);
}
