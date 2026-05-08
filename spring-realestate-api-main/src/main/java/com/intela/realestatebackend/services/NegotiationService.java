package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.negotiation.NegotiationMessage;
import com.intela.realestatebackend.models.negotiation.NegotiationStatus;
import com.intela.realestatebackend.models.negotiation.NegotiationThread;
import com.intela.realestatebackend.models.sales.InquiryStatus;
import com.intela.realestatebackend.models.sales.SaleInquiry;
import com.intela.realestatebackend.repositories.NegotiationMessageRepository;
import com.intela.realestatebackend.repositories.NegotiationThreadRepository;
import com.intela.realestatebackend.repositories.SaleInquiryRepository;
import com.intela.realestatebackend.repositories.UserRepository;
import com.intela.realestatebackend.requestResponse.NegotiationMessageRequest;
import com.intela.realestatebackend.requestResponse.NegotiationMessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class NegotiationService {
    private final NegotiationThreadRepository negotiationThreadRepository;
    private final NegotiationMessageRepository negotiationMessageRepository;
    private final SaleInquiryRepository saleInquiryRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public NegotiationMessageResponse sendMessage(HttpServletRequest request, Long inquiryId, NegotiationMessageRequest dto) {
        User sender = getUserByToken(request, jwtService, userRepository);
        SaleInquiry inquiry = saleInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Sale inquiry not found"));
        if (!sender.getId().equals(inquiry.getCustomer().getId()) && !sender.getId().equals(inquiry.getOwner().getId())) {
            throw new RuntimeException("Not authorized for this negotiation");
        }

        NegotiationThread thread = negotiationThreadRepository.findBySaleInquiryId(inquiryId)
                .orElseThrow(() -> new RuntimeException("Negotiation thread not found"));

        NegotiationMessage message = negotiationMessageRepository.save(
                NegotiationMessage.builder()
                        .thread(thread)
                        .sender(sender)
                        .offerAmount(dto.getOfferAmount())
                        .message(dto.getMessage())
                        .accepted(dto.getAccepted())
                        .build()
        );

        if (Boolean.TRUE.equals(dto.getAccepted())) {
            thread.setStatus(NegotiationStatus.ACCEPTED);
            inquiry.setStatus(InquiryStatus.CLOSED);
        } else {
            thread.setStatus(NegotiationStatus.OPEN);
            inquiry.setStatus(InquiryStatus.IN_NEGOTIATION);
        }
        negotiationThreadRepository.save(thread);
        saleInquiryRepository.save(inquiry);

        return map(message);
    }

    @Transactional(readOnly = true)
    public List<NegotiationMessageResponse> history(Long inquiryId) {
        NegotiationThread thread = negotiationThreadRepository.findBySaleInquiryId(inquiryId)
                .orElseThrow(() -> new RuntimeException("Negotiation thread not found"));
        return negotiationMessageRepository.findByThreadIdOrderByCreatedAtAsc(thread.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    private NegotiationMessageResponse map(NegotiationMessage msg) {
        return NegotiationMessageResponse.builder()
                .id(msg.getId())
                .threadId(msg.getThread().getId())
                .senderId(msg.getSender().getId())
                .offerAmount(msg.getOfferAmount())
                .message(msg.getMessage())
                .accepted(msg.getAccepted())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
