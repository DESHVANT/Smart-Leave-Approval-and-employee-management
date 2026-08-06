package com.smartleave.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BalanceAdjustmentRequest {
    @NotNull(message = "Adjustment amount is required")
    private Integer delta;

    private String note;
}