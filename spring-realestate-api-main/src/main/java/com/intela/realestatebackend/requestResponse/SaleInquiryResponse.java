package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.sales.InquiryStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SaleInquiryResponse {
    private Long inquiryId;
    private Integer propertyId;
    private Integer customerId;
    private Integer ownerId;
    private BigDecimal offeredAmount;
    private BigDecimal tokenAmount;
    private InquiryStatus status;
    private String message;
}
