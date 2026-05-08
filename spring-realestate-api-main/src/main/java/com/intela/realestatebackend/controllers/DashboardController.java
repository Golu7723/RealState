package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.requestResponse.AdminDashboardStatsResponse;
import com.intela.realestatebackend.requestResponse.CustomerDashboardStatsResponse;
import com.intela.realestatebackend.requestResponse.OwnerDashboardStatsResponse;
import com.intela.realestatebackend.services.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardStatsResponse> admin() {
        return ResponseEntity.ok(dashboardService.adminStats());
    }

    @GetMapping("/owner")
    public ResponseEntity<OwnerDashboardStatsResponse> owner(HttpServletRequest request) {
        return ResponseEntity.ok(dashboardService.ownerStats(request));
    }

    @GetMapping("/customer")
    public ResponseEntity<CustomerDashboardStatsResponse> customer(HttpServletRequest request) {
        return ResponseEntity.ok(dashboardService.customerStats(request));
    }
}
