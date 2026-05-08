package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.booking.BookingStatus;
import com.intela.realestatebackend.models.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    List<Booking> findByOwnerIdOrderByCreatedAtDesc(Integer ownerId);

    long countByOwnerId(Integer ownerId);

    long countByOwnerIdAndBookingStatus(Integer ownerId, BookingStatus status);

    long countByCustomerId(Integer customerId);

    long countByCustomerIdAndBookingStatus(Integer customerId, BookingStatus status);
}
