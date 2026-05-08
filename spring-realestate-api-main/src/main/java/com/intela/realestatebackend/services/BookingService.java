package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.booking.*;
import com.intela.realestatebackend.models.property.Property;
import com.intela.realestatebackend.models.wallet.Wallet;
import com.intela.realestatebackend.models.wallet.WalletTransaction;
import com.intela.realestatebackend.models.wallet.WalletTransactionStatus;
import com.intela.realestatebackend.models.wallet.WalletTransactionType;
import com.intela.realestatebackend.repositories.*;
import com.intela.realestatebackend.requestResponse.BookingActionRequest;
import com.intela.realestatebackend.requestResponse.BookingResponse;
import com.intela.realestatebackend.requestResponse.CreateBookingRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final PgUnitRepository pgUnitRepository;
    private final RentPaymentRepository rentPaymentRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final JwtService jwtService;

    @Transactional
    public BookingResponse createBooking(HttpServletRequest request, CreateBookingRequest dto) {
        User customer = getUserByToken(request, jwtService, userRepository);
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        User owner = property.getUser();

        PgUnit pgUnit = null;
        BigDecimal monthlyRent = property.getPrice() != null ? BigDecimal.valueOf(property.getPrice()) : BigDecimal.ZERO;
        BigDecimal securityDeposit = monthlyRent;
        if (dto.getPgUnitId() != null) {
            pgUnit = pgUnitRepository.findById(dto.getPgUnitId())
                    .orElseThrow(() -> new RuntimeException("PG unit not found"));
            if (pgUnit.getAvailableSlots() <= 0) {
                throw new RuntimeException("PG unit has no available slots");
            }
            monthlyRent = pgUnit.getMonthlyRent();
            securityDeposit = pgUnit.getSecurityDeposit();
        }

        Booking booking = bookingRepository.save(
                Booking.builder()
                        .property(property)
                        .customer(customer)
                        .owner(owner)
                        .pgUnit(pgUnit)
                        .bookingType(dto.getBookingType())
                        .bookingStatus(BookingStatus.REQUESTED)
                        .startDate(dto.getStartDate())
                        .endDate(dto.getEndDate())
                        .monthlyRent(monthlyRent)
                        .securityDeposit(securityDeposit)
                        .build()
        );

        return map(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(HttpServletRequest request, Long bookingId, BookingActionRequest actionRequest) {
        User actor = getUserByToken(request, jwtService, userRepository);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getOwner().getId().equals(actor.getId()) && !booking.getCustomer().getId().equals(actor.getId())) {
            throw new RuntimeException("Not authorized to update this booking");
        }

        if (actionRequest.getStatus() == BookingStatus.OWNER_APPROVED && booking.getPgUnit() != null) {
            PgUnit unit = booking.getPgUnit();
            if (unit.getAvailableSlots() <= 0) {
                throw new RuntimeException("No PG slots available");
            }
            unit.setAvailableSlots(unit.getAvailableSlots() - 1);
            pgUnitRepository.save(unit);
        }

        booking.setBookingStatus(actionRequest.getStatus());
        return map(bookingRepository.save(booking));
    }

    @Transactional
    public void payRent(HttpServletRequest request, Long bookingId, BigDecimal amount, Date dueDate, String referenceId) {
        User customer = getUserByToken(request, jwtService, userRepository);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Only booking customer can pay rent");
        }

        Wallet customerWallet = walletRepository.findByUserId(customer.getId())
                .orElseThrow(() -> new RuntimeException("Customer wallet not found"));
        Wallet ownerWallet = walletRepository.findByUserId(booking.getOwner().getId())
                .orElseGet(() -> walletRepository.save(Wallet.builder().user(booking.getOwner()).build()));

        if (customerWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        customerWallet.setBalance(customerWallet.getBalance().subtract(amount));
        ownerWallet.setBalance(ownerWallet.getBalance().add(amount));
        walletRepository.save(customerWallet);
        walletRepository.save(ownerWallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .wallet(customerWallet)
                .transactionType(WalletTransactionType.RENT_PAYMENT)
                .status(WalletTransactionStatus.SUCCESS)
                .amount(amount)
                .credit(false)
                .referenceId(referenceId)
                .description("Rent payment for booking " + bookingId)
                .build());
        walletTransactionRepository.save(WalletTransaction.builder()
                .wallet(ownerWallet)
                .transactionType(WalletTransactionType.RENT_PAYMENT)
                .status(WalletTransactionStatus.SUCCESS)
                .amount(amount)
                .credit(true)
                .referenceId(referenceId)
                .description("Rent received for booking " + bookingId)
                .build());

        rentPaymentRepository.save(RentPayment.builder()
                .booking(booking)
                .amount(amount)
                .dueDate(dueDate)
                .paidOn(new Date(System.currentTimeMillis()))
                .status(RentPaymentStatus.PAID)
                .referenceId(referenceId)
                .build());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listMyBookings(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId()).stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listOwnerBookings(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        return bookingRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId()).stream().map(this::map).toList();
    }

    private BookingResponse map(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getId())
                .propertyId(booking.getProperty().getId())
                .customerId(booking.getCustomer().getId())
                .ownerId(booking.getOwner().getId())
                .pgUnitId(booking.getPgUnit() != null ? booking.getPgUnit().getId() : null)
                .bookingType(booking.getBookingType())
                .bookingStatus(booking.getBookingStatus())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .monthlyRent(booking.getMonthlyRent())
                .securityDeposit(booking.getSecurityDeposit())
                .build();
    }
}
