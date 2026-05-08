package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.property.*;
import com.intela.realestatebackend.repositories.PropertyApprovalRepository;
import com.intela.realestatebackend.repositories.PropertyFacilityRepository;
import com.intela.realestatebackend.repositories.PropertyRepository;
import com.intela.realestatebackend.repositories.UserRepository;
import com.intela.realestatebackend.requestResponse.PropertyApprovalRequest;
import com.intela.realestatebackend.requestResponse.PropertyApprovalResponse;
import com.intela.realestatebackend.requestResponse.UpdatePropertyFacilitiesRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class PropertyModerationService {
    private final PropertyRepository propertyRepository;
    private final PropertyFacilityRepository propertyFacilityRepository;
    private final PropertyApprovalRepository propertyApprovalRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Transactional
    public Set<FacilityType> replaceFacilities(Integer propertyId, UpdatePropertyFacilitiesRequest request) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        propertyFacilityRepository.deleteByPropertyId(propertyId);
        request.getFacilities().forEach(facilityType -> propertyFacilityRepository.save(
                PropertyFacility.builder()
                        .property(property)
                        .facilityType(facilityType)
                        .build()
        ));
        return request.getFacilities();
    }

    @Transactional(readOnly = true)
    public Set<FacilityType> getFacilities(Integer propertyId) {
        return propertyFacilityRepository.findByPropertyId(propertyId)
                .stream()
                .map(PropertyFacility::getFacilityType)
                .collect(java.util.stream.Collectors.toSet());
    }

    @Transactional
    public PropertyApprovalResponse upsertApproval(Integer propertyId, PropertyApprovalRequest request, HttpServletRequest servletRequest) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        User admin = getUserByToken(servletRequest, jwtService, userRepository);

        PropertyApproval approval = propertyApprovalRepository.findByPropertyId(propertyId)
                .orElseGet(() -> PropertyApproval.builder()
                        .property(property)
                        .status(ListingApprovalStatus.PENDING)
                        .build());
        approval.setStatus(request.getStatus());
        approval.setRemarks(request.getRemarks());
        approval.setActionBy(admin);
        PropertyApproval saved = propertyApprovalRepository.save(approval);
        return map(saved);
    }

    @Transactional(readOnly = true)
    public List<PropertyApprovalResponse> listApprovals(ListingApprovalStatus status) {
        return propertyApprovalRepository.findByStatus(status)
                .stream()
                .map(this::map)
                .toList();
    }

    private PropertyApprovalResponse map(PropertyApproval approval) {
        return PropertyApprovalResponse.builder()
                .propertyId(approval.getProperty().getId())
                .status(approval.getStatus())
                .actionByUserId(approval.getActionBy() != null ? approval.getActionBy().getId() : null)
                .remarks(approval.getRemarks())
                .updatedAt(approval.getUpdatedAt())
                .build();
    }
}
