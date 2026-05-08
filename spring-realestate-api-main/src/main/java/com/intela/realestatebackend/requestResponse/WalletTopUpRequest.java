package com.intela.realestatebackend.requestResponse;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WalletTopUpRequest {
    @NotNull
    @DecimalMin("1.00")
    private BigDecimal amount;
}
