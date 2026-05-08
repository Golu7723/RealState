package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.requestResponse.BookingActionRequest;
import com.intela.realestatebackend.requestResponse.BookingResponse;
import com.intela.realestatebackend.requestResponse.CreateBookingRequest;
import com.intela.realestatebackend.services.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(
            HttpServletRequest request,
            @Valid @RequestBody CreateBookingRequest dto
    ) {
        return ResponseEntity.ok(bookingService.createBooking(request, dto));
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            HttpServletRequest request,
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingActionRequest actionRequest
    ) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(request, bookingId, actionRequest));
    }

    @PostMapping("/{bookingId}/rent-payment")
    public ResponseEntity<String> payRent(
            HttpServletRequest request,
            @PathVariable Long bookingId,
            @RequestParam BigDecimal amount,
            @RequestParam Date dueDate,
            @RequestParam String referenceId
    ) {
        bookingService.payRent(request, bookingId, amount, dueDate, referenceId);
        return ResponseEntity.ok("Rent payment successful");
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponse>> myBookings(HttpServletRequest request) {
        return ResponseEntity.ok(bookingService.listMyBookings(request));
    }

    @GetMapping("/owner")
    public ResponseEntity<List<BookingResponse>> ownerBookings(HttpServletRequest request) {
        return ResponseEntity.ok(bookingService.listOwnerBookings(request));
    }
}
