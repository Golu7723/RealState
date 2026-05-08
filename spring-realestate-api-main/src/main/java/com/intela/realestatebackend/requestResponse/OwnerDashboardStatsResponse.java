package com.intela.realestatebackend.requestResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OwnerDashboardStatsResponse {
    private long totalListings;
    private long totalBookings;
    private long pendingBookings;
    private long totalInquiries;
    private long walletCreditsCount;
}
