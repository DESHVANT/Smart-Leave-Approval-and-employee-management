package com.smartleave.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DashboardResponse {
    long totalEmployees;
    long totalPendingLeaves;
    long totalApprovedLeaves;
    long totalRejectedLeaves;
    long lowBalanceEmployees;
}