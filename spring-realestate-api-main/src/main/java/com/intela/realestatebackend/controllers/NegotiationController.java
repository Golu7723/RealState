package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.requestResponse.NegotiationMessageRequest;
import com.intela.realestatebackend.requestResponse.NegotiationMessageResponse;
import com.intela.realestatebackend.services.NegotiationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/negotiations")
@RequiredArgsConstructor
public class NegotiationController {
    private final NegotiationService negotiationService;

    @PostMapping("/{inquiryId}/messages")
    public ResponseEntity<NegotiationMessageResponse> send(
            HttpServletRequest request,
            @PathVariable Long inquiryId,
            @Valid @RequestBody NegotiationMessageRequest dto) {
        return ResponseEntity.ok(negotiationService.sendMessage(request, inquiryId, dto));
    }

    @GetMapping("/{inquiryId}/messages")
    public ResponseEntity<List<NegotiationMessageResponse>> history(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(negotiationService.history(inquiryId));
    }
}
