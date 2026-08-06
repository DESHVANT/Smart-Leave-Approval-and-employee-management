package com.smartleave.service;

import com.smartleave.dto.LeaveApplyRequest;
import com.smartleave.dto.LeaveResponse;
import com.smartleave.exception.BadRequestException;
import com.smartleave.exception.ResourceNotFoundException;
import com.smartleave.model.LeaveRequest;
import com.smartleave.model.LeaveStatus;
import com.smartleave.model.User;
import com.smartleave.repository.LeaveRequestRepository;
import com.smartleave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private static final Logger log = LoggerFactory.getLogger(LeaveService.class);
    private static final List<LeaveStatus> ACTIVE_STATUSES = List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED);

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public LeaveResponse applyLeave(String email, LeaveApplyRequest request) {
        User employee = getUser(email);
        validateRequestDates(request.getStartDate(), request.getEndDate());
        int daysRequested = calculateDays(request.getStartDate(), request.getEndDate());

        if (leaveRequestRepository.existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                employee, ACTIVE_STATUSES, request.getEndDate(), request.getStartDate())) {
            throw new BadRequestException("A duplicate or overlapping leave request already exists");
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .daysRequested(daysRequested)
                .reason(request.getReason().trim())
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        log.info("Employee {} created leave request {}", employee.getEmail(), saved.getId());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getMyLeaves(String email) {
        User employee = getUser(email);
        return leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LeaveResponse cancelLeave(String email, Long leaveId) {
        User employee = getUser(email);
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (!leaveRequest.getEmployee().getId().equals(employee.getId())) {
            throw new BadRequestException("You can only cancel your own leave request");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be cancelled");
        }

        leaveRequest.setStatus(LeaveStatus.CANCELLED);
        leaveRequest.setReviewNote("Cancelled by employee");
        leaveRequest.setReviewedAt(LocalDateTime.now());
        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public LeaveResponse approve(Long leaveId, User reviewer, String reviewNote) {
        LeaveRequest leaveRequest = getLeave(leaveId);
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be approved");
        }

        if (leaveRequest.getEmployee().getLeaveBalance() < leaveRequest.getDaysRequested()) {
            throw new BadRequestException("Leave balance cannot become negative");
        }

        User employee = leaveRequest.getEmployee();
        employee.setLeaveBalance(employee.getLeaveBalance() - leaveRequest.getDaysRequested());
        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setReviewNote(reviewNote);
        leaveRequest.setReviewedAt(LocalDateTime.now());
        leaveRequest.setReviewedBy(reviewer);

        userRepository.save(employee);
        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public LeaveResponse reject(Long leaveId, User reviewer, String reviewNote) {
        LeaveRequest leaveRequest = getLeave(leaveId);
        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be rejected");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setReviewNote(reviewNote);
        leaveRequest.setReviewedAt(LocalDateTime.now());
        leaveRequest.setReviewedBy(reviewer);
        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    private void validateRequestDates(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date cannot be before start date");
        }
        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Past leave requests are not allowed");
        }
    }

    private int calculateDays(LocalDate startDate, LocalDate endDate) {
        return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    LeaveResponse toResponse(LeaveRequest leaveRequest) {
        return LeaveResponse.builder()
                .id(leaveRequest.getId())
                .employeeId(leaveRequest.getEmployee().getId())
                .employeeName(leaveRequest.getEmployee().getName())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .daysRequested(leaveRequest.getDaysRequested())
                .reason(leaveRequest.getReason())
                .status(leaveRequest.getStatus())
                .reviewNote(leaveRequest.getReviewNote())
                .createdAt(leaveRequest.getCreatedAt())
                .reviewedAt(leaveRequest.getReviewedAt())
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private LeaveRequest getLeave(Long leaveId) {
        return leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
    }
}