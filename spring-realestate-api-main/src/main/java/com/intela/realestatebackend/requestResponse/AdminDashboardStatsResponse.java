package com.intela.realestatebackend.requestResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalProperties;
    private long totalBookings;
    private long pendingApprovals;
    private long totalTransactions;
    private long totalInquiries;
}
