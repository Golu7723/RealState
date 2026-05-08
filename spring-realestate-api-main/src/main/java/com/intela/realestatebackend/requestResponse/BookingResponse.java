package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.booking.BookingStatus;
import com.intela.realestatebackend.models.booking.BookingType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@Builder
public class BookingResponse {
    private Long bookingId;
    private Integer propertyId;
    private Integer customerId;
    private Integer ownerId;
    private Long pgUnitId;
    private BookingType bookingType;
    private BookingStatus bookingStatus;
    private Date startDate;
    private Date endDate;
    private BigDecimal monthlyRent;
    private BigDecimal securityDeposit;
}
