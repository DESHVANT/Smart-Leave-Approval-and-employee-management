package com.smartleave.service;

import com.smartleave.dto.*;
import com.smartleave.exception.BadRequestException;
import com.smartleave.exception.ResourceNotFoundException;
import com.smartleave.model.LeaveStatus;
import com.smartleave.model.Role;
import com.smartleave.model.User;
import com.smartleave.repository.LeaveRequestRepository;
import com.smartleave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveService leaveService;

    public DashboardResponse getDashboard() {
        long totalEmployees = userRepository.findByRoleOrderByNameAsc(Role.ROLE_EMPLOYEE).size();
        long lowBalanceEmployees = userRepository.findByRoleOrderByNameAsc(Role.ROLE_EMPLOYEE).stream()
                .filter(user -> user.getLeaveBalance() <= 3)
                .count();

        return DashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .totalPendingLeaves(leaveRequestRepository.countByStatus(LeaveStatus.PENDING))
                .totalApprovedLeaves(leaveRequestRepository.countByStatus(LeaveStatus.APPROVED))
                .totalRejectedLeaves(leaveRequestRepository.countByStatus(LeaveStatus.REJECTED))
                .lowBalanceEmployees(lowBalanceEmployees)
                .build();
    }

    public List<EmployeeSummaryResponse> getEmployees() {
        return userRepository.findByRoleOrderByNameAsc(Role.ROLE_EMPLOYEE).stream()
                .map(this::toEmployeeSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaves() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(leaveService::toResponse)
                .toList();
    }

    @Transactional
    public LeaveResponse approveLeave(String reviewerEmail, Long leaveId, AdminDecisionRequest request) {
        User reviewer = getAdmin(reviewerEmail);
        return leaveService.approve(leaveId, reviewer, request.getReviewNote());
    }

    @Transactional
    public LeaveResponse rejectLeave(String reviewerEmail, Long leaveId, AdminDecisionRequest request) {
        User reviewer = getAdmin(reviewerEmail);
        return leaveService.reject(leaveId, reviewer, request.getReviewNote());
    }

    @Transactional
    public ProfileResponse adjustBalance(Long employeeId, BalanceAdjustmentRequest request) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        if (employee.getRole() != Role.ROLE_EMPLOYEE) {
            throw new BadRequestException("Only employee accounts have leave balances");
        }

        int newBalance = employee.getLeaveBalance() + request.getDelta();
        if (newBalance < 0) {
            throw new BadRequestException("Leave balance cannot become negative");
        }

        employee.setLeaveBalance(newBalance);
        User saved = userRepository.save(employee);
        return ProfileResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .department(saved.getDepartment())
                .position(saved.getPosition())
                .phone(saved.getPhone())
                .role(saved.getRole())
                .leaveBalance(saved.getLeaveBalance())
                .pendingLeaves(leaveRequestRepository.countByEmployeeAndStatus(saved, LeaveStatus.PENDING))
                .approvedLeaves(leaveRequestRepository.countByEmployeeAndStatus(saved, LeaveStatus.APPROVED))
                .rejectedLeaves(leaveRequestRepository.countByEmployeeAndStatus(saved, LeaveStatus.REJECTED))
                .build();
    }

    private EmployeeSummaryResponse toEmployeeSummary(User user) {
        return EmployeeSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .position(user.getPosition())
                .role(user.getRole())
                .leaveBalance(user.getLeaveBalance())
                .pendingLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.PENDING))
                .approvedLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.APPROVED))
                .rejectedLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.REJECTED))
                .build();
    }

    private User getAdmin(String email) {
        User admin = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Only administrators can perform this action");
        }
        return admin;
    }
}