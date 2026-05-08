package com.intela.realestatebackend.services;

import com.intela.realestatebackend.models.User;
import com.intela.realestatebackend.models.wallet.Wallet;
import com.intela.realestatebackend.models.wallet.WalletTransaction;
import com.intela.realestatebackend.models.wallet.WalletTransactionStatus;
import com.intela.realestatebackend.models.wallet.WalletTransactionType;
import com.intela.realestatebackend.repositories.UserRepository;
import com.intela.realestatebackend.repositories.WalletRepository;
import com.intela.realestatebackend.repositories.WalletTransactionRepository;
import com.intela.realestatebackend.requestResponse.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static com.intela.realestatebackend.util.Util.getUserByToken;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public WalletResponse topUp(HttpServletRequest request, WalletTopUpRequest topUpRequest) {
        User user = getUserByToken(request, jwtService, userRepository);
        Wallet wallet = getOrCreateWallet(user);
        wallet.setBalance(wallet.getBalance().add(topUpRequest.getAmount()));
        walletRepository.save(wallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(wallet)
                        .transactionType(WalletTransactionType.TOP_UP)
                        .status(WalletTransactionStatus.SUCCESS)
                        .amount(topUpRequest.getAmount())
                        .credit(true)
                        .description("Wallet top-up")
                        .build()
        );
        return buildWalletResponse(wallet);
    }

    @Transactional
    public WalletResponse transfer(HttpServletRequest request, WalletTransferRequest transferRequest) {
        User sender = getUserByToken(request, jwtService, userRepository);
        User recipient = userRepository.findById(transferRequest.getRecipientUserId())
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        Wallet senderWallet = getOrCreateWallet(sender);
        Wallet recipientWallet = getOrCreateWallet(recipient);

        if (senderWallet.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Insufficient wallet balance");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(transferRequest.getAmount()));
        recipientWallet.setBalance(recipientWallet.getBalance().add(transferRequest.getAmount()));
        walletRepository.save(senderWallet);
        walletRepository.save(recipientWallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(senderWallet)
                        .transactionType(WalletTransactionType.TRANSFER)
                        .status(WalletTransactionStatus.SUCCESS)
                        .amount(transferRequest.getAmount())
                        .credit(false)
                        .referenceId(transferRequest.getReferenceId())
                        .description("Transfer to user " + recipient.getId())
                        .build()
        );
        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(recipientWallet)
                        .transactionType(WalletTransactionType.TRANSFER)
                        .status(WalletTransactionStatus.SUCCESS)
                        .amount(transferRequest.getAmount())
                        .credit(true)
                        .referenceId(transferRequest.getReferenceId())
                        .description("Transfer from user " + sender.getId())
                        .build()
        );
        return buildWalletResponse(senderWallet);
    }

    @Transactional(readOnly = true)
    public WalletResponse getMyWallet(HttpServletRequest request) {
        User user = getUserByToken(request, jwtService, userRepository);
        Wallet wallet = getOrCreateWallet(user);
        return buildWalletResponse(wallet);
    }

    private Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> walletRepository.save(
                        Wallet.builder()
                                .user(user)
                                .balance(BigDecimal.ZERO)
                                .currency("INR")
                                .build()
                ));
    }

    private WalletResponse buildWalletResponse(Wallet wallet) {
        List<WalletTransactionDto> transactions = walletTransactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(tx -> WalletTransactionDto.builder()
                        .id(tx.getId())
                        .transactionType(tx.getTransactionType())
                        .status(tx.getStatus())
                        .amount(tx.getAmount())
                        .credit(tx.getCredit())
                        .referenceId(tx.getReferenceId())
                        .description(tx.getDescription())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .toList();

        return WalletResponse.builder()
                .walletId(wallet.getId())
                .userId(wallet.getUser().getId())
                .balance(wallet.getBalance())
                .currency(wallet.getCurrency())
                .transactions(transactions)
                .build();
    }
}
