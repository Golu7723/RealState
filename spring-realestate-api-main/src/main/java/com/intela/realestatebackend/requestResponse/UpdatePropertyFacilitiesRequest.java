package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.property.FacilityType;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class UpdatePropertyFacilitiesRequest {
    @NotEmpty
    private Set<FacilityType> facilities;
}
