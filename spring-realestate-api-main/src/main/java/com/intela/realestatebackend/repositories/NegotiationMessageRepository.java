package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.negotiation.NegotiationMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NegotiationMessageRepository extends JpaRepository<NegotiationMessage, Long> {
    List<NegotiationMessage> findByThreadIdOrderByCreatedAtAsc(Long threadId);
}
