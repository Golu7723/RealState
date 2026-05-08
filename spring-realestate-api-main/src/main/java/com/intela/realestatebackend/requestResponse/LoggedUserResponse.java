package com.intela.realestatebackend.requestResponse;

import com.intela.realestatebackend.models.archetypes.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoggedUserResponse {
    private String fullName;
    private String phone;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String email;
    private Role role;
}
