package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.booking.BookingStatus;
import com.intela.realestatebackend.models.property.ListingApprovalStatus;
import com.intela.realestatebackend.repositories.*;
import com.intela.realestatebackend.requestResponse.AdminDashboardStatsResponse;
import com.intela.realestatebackend.requestResponse.CustomerDashboardStatsResponse;
import com.intela.realestatebackend.requestResponse.OwnerDashboardStatsResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final PropertyApprovalRepository propertyApprovalRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final SaleInquiryRepository saleInquiryRepository;
    private final WalletRepository walletRepository;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse adminStats() {
        long userCount = userRepository.count();
        return AdminDashboardStatsResponse.builder()
                .totalUsers(userCount)
                .totalProperties(propertyRepository.count())
                .totalBookings(bookingRepository.count())
                .pendingApprovals(propertyApprovalRepository.countByStatus(ListingApprovalStatus.PENDING))
                .totalTransactions(walletTransactionRepository.count())
                .totalInquiries(saleInquiryRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public OwnerDashboardStatsResponse ownerStats(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        return OwnerDashboardStatsResponse.builder()
                .totalListings(propertyRepository.countByUserId(user.getId()))
                .totalBookings(bookingRepository.countByOwnerId(user.getId()))
                .pendingBookings(bookingRepository.countByOwnerIdAndBookingStatus(user.getId(), BookingStatus.REQUESTED))
                .totalInquiries(saleInquiryRepository.countByOwnerId(user.getId()))
                .walletCreditsCount(walletTransactionRepository.countByWalletUserIdAndCreditTrue(user.getId()))
                .build();
    }

    @Transactional(readOnly = true)
    public CustomerDashboardStatsResponse customerStats(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        BigDecimal balance = walletRepository.findByUserId(user.getId())
                .map(w -> w.getBalance())
                .orElse(BigDecimal.ZERO);
        return CustomerDashboardStatsResponse.builder()
                .totalBookings(bookingRepository.countByCustomerId(user.getId()))
                .activeBookings(bookingRepository.countByCustomerIdAndBookingStatus(user.getId(), BookingStatus.ACTIVE))
                .totalInquiries(saleInquiryRepository.countByCustomerId(user.getId()))
                .walletBalance(balance)
                .build();
    }
}
