package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.property.ListingApprovalStatus;
import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class PropertyApprovalResponse {
    private Integer propertyId;
    private ListingApprovalStatus status;
    private Integer actionByUserId;
    private String remarks;
    private Timestamp updatedAt;
}
