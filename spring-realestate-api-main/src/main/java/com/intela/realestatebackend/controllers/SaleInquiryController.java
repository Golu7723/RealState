package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.requestResponse.CreateSaleInquiryRequest;
import com.intela.realestatebackend.requestResponse.SaleInquiryResponse;
import com.intela.realestatebackend.services.SaleInquiryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sale-inquiries")
@RequiredArgsConstructor
public class SaleInquiryController {
    private final SaleInquiryService saleInquiryService;

    @PostMapping
    public ResponseEntity<SaleInquiryResponse> create(
            HttpServletRequest request,
            @Valid @RequestBody CreateSaleInquiryRequest dto) {
        return ResponseEntity.ok(saleInquiryService.createInquiry(request, dto));
    }

    @GetMapping("/me")
    public ResponseEntity<List<SaleInquiryResponse>> myInquiries(HttpServletRequest request) {
        return ResponseEntity.ok(saleInquiryService.myInquiries(request));
    }
}
