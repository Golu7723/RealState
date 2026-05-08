package com.intela.realestatebackend.requestResponse;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSaleInquiryRequest {
    @NotNull
    private Integer propertyId;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal offeredAmount;

    @NotNull
    @DecimalMin("1.00")
    private BigDecimal tokenAmount;

    private String message;
}
