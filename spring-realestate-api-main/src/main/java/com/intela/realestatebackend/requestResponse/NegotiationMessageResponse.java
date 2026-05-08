package com.intela.realestatebackend.requestResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@Builder
public class NegotiationMessageResponse {
    private Long id;
    private Long threadId;
    private Integer senderId;
    private BigDecimal offerAmount;
    private String message;
    private Boolean accepted;
    private Timestamp createdAt;
}
