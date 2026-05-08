package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.requestResponse.WalletResponse;
import com.intela.realestatebackend.requestResponse.WalletTopUpRequest;
import com.intela.realestatebackend.requestResponse.WalletTransferRequest;
import com.intela.realestatebackend.services.WalletService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {
    private final WalletService walletService;

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> myWallet(HttpServletRequest request) {
        return ResponseEntity.ok(walletService.getMyWallet(request));
    }

    @PostMapping("/top-up")
    public ResponseEntity<WalletResponse> topUp(
            HttpServletRequest request,
            @Valid @RequestBody WalletTopUpRequest topUpRequest) {
        return ResponseEntity.ok(walletService.topUp(request, topUpRequest));
    }

    @PostMapping("/transfer")
    public ResponseEntity<WalletResponse> transfer(
            HttpServletRequest request,
            @Valid @RequestBody WalletTransferRequest transferRequest) {
        return ResponseEntity.ok(walletService.transfer(request, transferRequest));
    }
}
