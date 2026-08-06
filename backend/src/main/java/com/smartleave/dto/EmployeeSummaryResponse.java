package com.smartleave.dto;

import com.smartleave.model.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class EmployeeSummaryResponse {
    Long id;
    String name;
    String email;
    String department;
    String position;
    Role role;
    int leaveBalance;
    long pendingLeaves;
    long approvedLeaves;
    long rejectedLeaves;
}