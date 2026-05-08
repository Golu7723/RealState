package com.intela.realestatebackend.requestResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CustomerDashboardStatsResponse {
    private long totalBookings;
    private long activeBookings;
    private long totalInquiries;
    private BigDecimal walletBalance;
}
