package com.intela.realestatebackend.requestResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class WalletResponse {
    private Long walletId;
    private Integer userId;
    private BigDecimal balance;
    private String currency;
    private List<WalletTransactionDto> transactions;
}
