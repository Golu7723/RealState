package com.intela.realestatebackend.models.archetypes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.intela.realestatebackend.models.archetypes.Permission.*;

@RequiredArgsConstructor
public enum Role {
    USER(
            Set.of(
                    CUSTOMER_CREATE,
                    CUSTOMER_UPDATE,
                    CUSTOMER_DELETE,
                    CUSTOMER_READ
            )
    ),
    AGENT(
            Set.of(
                    DEALER_CREATE,
                    DEALER_UPDATE,
                    DEALER_DELETE,
                    DEALER_READ,
                    OWNER_CREATE,
                    OWNER_UPDATE,
                    OWNER_DELETE,
                    OWNER_READ
            )
    ),
    ADMIN(
            Set.of(
                    ADMIN_CREATE,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_READ,
                    DEALER_CREATE,
                    DEALER_UPDATE,
                    DEALER_DELETE,
                    DEALER_READ,
                    CUSTOMER_CREATE,
                    CUSTOMER_UPDATE,
                    CUSTOMER_DELETE,
                    CUSTOMER_READ
            )
    ),
    DEALER(
            Set.of(
                    DEALER_CREATE,
                    DEALER_UPDATE,
                    DEALER_DELETE,
                    DEALER_READ
            )
    ),
    PROPERTY_OWNER(
            Set.of(
                    OWNER_CREATE,
                    OWNER_UPDATE,
                    OWNER_DELETE,
                    OWNER_READ
            )
    ),
    CUSTOMER(
            Set.of(
                    CUSTOMER_CREATE,
                    CUSTOMER_UPDATE,
                    CUSTOMER_DELETE,
                    CUSTOMER_READ
            )
    );

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
