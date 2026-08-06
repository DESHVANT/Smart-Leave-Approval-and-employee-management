package com.smartleave.dto;

import com.smartleave.model.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    Long userId;
    String name;
    String email;
    Role role;
    int leaveBalance;
}