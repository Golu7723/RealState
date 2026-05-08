package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.negotiation.NegotiationStatus;
import com.intela.realestatebackend.models.negotiation.NegotiationThread;
import com.intela.realestatebackend.models.property.Property;
import com.intela.realestatebackend.models.sales.InquiryStatus;
import com.intela.realestatebackend.models.sales.SaleInquiry;
import com.intela.realestatebackend.repositories.NegotiationThreadRepository;
import com.intela.realestatebackend.repositories.PropertyRepository;
import com.intela.realestatebackend.repositories.SaleInquiryRepository;
import com.intela.realestatebackend.repositories.UserRepository;
import com.intela.realestatebackend.requestResponse.CreateSaleInquiryRequest;
import com.intela.realestatebackend.requestResponse.SaleInquiryResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class SaleInquiryService {
    private final SaleInquiryRepository saleInquiryRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NegotiationThreadRepository negotiationThreadRepository;
    private final JwtService jwtService;

    @Transactional
    public SaleInquiryResponse createInquiry(HttpServletRequest request, CreateSaleInquiryRequest dto) {
        User customer = getUserByToken(request, jwtService, userRepository);
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        SaleInquiry inquiry = saleInquiryRepository.save(
                SaleInquiry.builder()
                        .property(property)
                        .customer(customer)
                        .owner(property.getUser())
                        .offeredAmount(dto.getOfferedAmount())
                        .tokenAmount(dto.getTokenAmount())
                        .status(InquiryStatus.OPEN)
                        .message(dto.getMessage())
                        .build()
        );

        negotiationThreadRepository.save(
                NegotiationThread.builder()
                        .saleInquiry(inquiry)
                        .status(NegotiationStatus.OPEN)
                        .build()
        );
        return map(inquiry);
    }

    @Transactional(readOnly = true)
    public List<SaleInquiryResponse> myInquiries(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        return saleInquiryRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId()).stream().map(this::map).toList();
    }

    private SaleInquiryResponse map(SaleInquiry inquiry) {
        return SaleInquiryResponse.builder()
                .inquiryId(inquiry.getId())
                .propertyId(inquiry.getProperty().getId())
                .customerId(inquiry.getCustomer().getId())
                .ownerId(inquiry.getOwner().getId())
                .offeredAmount(inquiry.getOfferedAmount())
                .tokenAmount(inquiry.getTokenAmount())
                .status(inquiry.getStatus())
                .message(inquiry.getMessage())
                .build();
    }
}
