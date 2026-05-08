package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.booking.BookingType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;

@Data
public class CreateBookingRequest {
    @NotNull
    private Integer propertyId;

    private Long pgUnitId;

    @NotNull
    private BookingType bookingType;

    @NotNull
    private Date startDate;

    private Date endDate;
}
