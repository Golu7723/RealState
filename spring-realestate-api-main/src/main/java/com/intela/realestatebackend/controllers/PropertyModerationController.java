package com.intela.realestatebackend.controllers;

import com.intela.realestatebackend.models.property.FacilityType;
import com.intela.realestatebackend.models.property.ListingApprovalStatus;
import com.intela.realestatebackend.requestResponse.PropertyApprovalRequest;
import com.intela.realestatebackend.requestResponse.PropertyApprovalResponse;
import com.intela.realestatebackend.requestResponse.UpdatePropertyFacilitiesRequest;
import com.intela.realestatebackend.services.PropertyModerationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/property-moderation")
@RequiredArgsConstructor
public class PropertyModerationController {
    private final PropertyModerationService propertyModerationService;

    @PutMapping("/{propertyId}/facilities")
    public ResponseEntity<Set<FacilityType>> replaceFacilities(
            @PathVariable Integer propertyId,
            @Valid @RequestBody UpdatePropertyFacilitiesRequest request) {
        return ResponseEntity.ok(propertyModerationService.replaceFacilities(propertyId, request));
    }

    @GetMapping("/{propertyId}/facilities")
    public ResponseEntity<Set<FacilityType>> getFacilities(@PathVariable Integer propertyId) {
        return ResponseEntity.ok(propertyModerationService.getFacilities(propertyId));
    }

    @PostMapping("/{propertyId}/approval")
    public ResponseEntity<PropertyApprovalResponse> approveOrReject(
            @PathVariable Integer propertyId,
            @Valid @RequestBody PropertyApprovalRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(propertyModerationService.upsertApproval(propertyId, request, servletRequest));
    }

    @GetMapping("/approval")
    public ResponseEntity<List<PropertyApprovalResponse>> listByStatus(
            @RequestParam ListingApprovalStatus status) {
        return ResponseEntity.ok(propertyModerationService.listApprovals(status));
    }
}
