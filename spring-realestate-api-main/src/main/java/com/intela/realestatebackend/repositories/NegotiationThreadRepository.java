package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.negotiation.NegotiationThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NegotiationThreadRepository extends JpaRepository<NegotiationThread, Long> {
    Optional<NegotiationThread> findBySaleInquiryId(Long saleInquiryId);
}
