package com.intela.realestatebackend.repositories;

import com.intela.realestatebackend.models.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Integer userId);
}
