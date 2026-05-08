package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.sales.SaleInquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleInquiryRepository extends JpaRepository<SaleInquiry, Long> {
    List<SaleInquiry> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    List<SaleInquiry> findByOwnerIdOrderByCreatedAtDesc(Integer ownerId);

    long countByCustomerId(Integer customerId);

    long countByOwnerId(Integer ownerId);
}
