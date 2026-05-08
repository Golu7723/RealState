package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.wallet.WalletTransactionStatus;
import com.intela.realestatebackend.models.wallet.WalletTransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@Builder
public class WalletTransactionDto {
    private Long id;
    private WalletTransactionType transactionType;
    private WalletTransactionStatus status;
    private BigDecimal amount;
    private Boolean credit;
    private String referenceId;
    private String description;
    private Timestamp createdAt;
}
