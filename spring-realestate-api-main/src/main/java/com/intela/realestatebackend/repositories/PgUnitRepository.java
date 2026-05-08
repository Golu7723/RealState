package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.booking.PgUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PgUnitRepository extends JpaRepository<PgUnit, Long> {
    List<PgUnit> findByPropertyId(Integer propertyId);
}
