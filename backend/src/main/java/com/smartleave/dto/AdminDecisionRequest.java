package com.smartleave.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminDecisionRequest {
    @Size(max = 500, message = "Review note must be 500 characters or fewer")
    private String reviewNote;
}