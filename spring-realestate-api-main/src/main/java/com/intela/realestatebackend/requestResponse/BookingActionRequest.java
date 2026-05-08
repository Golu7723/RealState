package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.booking.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingActionRequest {
    @NotNull
    private BookingStatus status;
}
