package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.property.ListingApprovalStatus;
import com.intela.realestatebackend.models.property.PropertyApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyApprovalRepository extends JpaRepository<PropertyApproval, Long> {
    Optional<PropertyApproval> findByPropertyId(Integer propertyId);

    List<PropertyApproval> findByStatus(ListingApprovalStatus status);

    long countByStatus(ListingApprovalStatus status);
}
