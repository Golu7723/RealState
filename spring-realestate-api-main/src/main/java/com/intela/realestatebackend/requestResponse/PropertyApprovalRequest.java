package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.property.ListingApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PropertyApprovalRequest {
    @NotNull
    private ListingApprovalStatus status;

    private String remarks;
}
