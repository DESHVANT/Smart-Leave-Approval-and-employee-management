package com.smartleave.dto;

import com.smartleave.model.LeaveStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Value
@Builder
public class LeaveResponse {
    Long id;
    Long employeeId;
    String employeeName;
    LocalDate startDate;
    LocalDate endDate;
    int daysRequested;
    String reason;
    LeaveStatus status;
    String reviewNote;
    LocalDateTime createdAt;
    LocalDateTime reviewedAt;
}