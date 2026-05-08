package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.property.PropertyFacility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyFacilityRepository extends JpaRepository<PropertyFacility, Long> {
    List<PropertyFacility> findByPropertyId(Integer propertyId);

    void deleteByPropertyId(Integer propertyId);
}
