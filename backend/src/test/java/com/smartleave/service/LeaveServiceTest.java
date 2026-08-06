package com.smartleave.service;

import com.smartleave.dto.LeaveApplyRequest;
import com.smartleave.dto.LeaveResponse;
import com.smartleave.exception.BadRequestException;
import com.smartleave.model.LeaveRequest;
import com.smartleave.model.LeaveStatus;
import com.smartleave.model.Role;
import com.smartleave.model.User;
import com.smartleave.repository.LeaveRequestRepository;
import com.smartleave.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock private LeaveRequestRepository leaveRequestRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private LeaveService leaveService;

    @Test
    void applyLeaveRejectsPastDates() {
        LeaveApplyRequest request = buildRequest(LocalDate.now().minusDays(1), LocalDate.now(), "Family travel");
        when(userRepository.findByEmail("employee@smartleave.test")).thenReturn(Optional.of(employee()));

        assertThatThrownBy(() -> leaveService.applyLeave("employee@smartleave.test", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Past leave requests are not allowed");
    }

    @Test
    void applyLeaveRejectsDuplicateOverlaps() {
        LeaveApplyRequest request = buildRequest(LocalDate.now().plusDays(2), LocalDate.now().plusDays(4), "Family travel");
        when(userRepository.findByEmail("employee@smartleave.test")).thenReturn(Optional.of(employee()));
        when(leaveRequestRepository.existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                any(User.class), any(List.class), any(LocalDate.class), any(LocalDate.class))).thenReturn(true);

        assertThatThrownBy(() -> leaveService.applyLeave("employee@smartleave.test", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("duplicate or overlapping");
    }

    @Test
    void applyLeaveSavesPendingRequest() {
        User employee = employee();
        LeaveApplyRequest request = buildRequest(LocalDate.now().plusDays(2), LocalDate.now().plusDays(4), "Family travel");
        when(userRepository.findByEmail("employee@smartleave.test")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                any(User.class), any(List.class), any(LocalDate.class), any(LocalDate.class))).thenReturn(false);
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> {
            LeaveRequest saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        LeaveResponse response = leaveService.applyLeave("employee@smartleave.test", request);

        assertThat(response.getStatus()).isEqualTo(LeaveStatus.PENDING);
        assertThat(response.getDaysRequested()).isEqualTo(3);
        assertThat(response.getEmployeeId()).isEqualTo(employee.getId());
    }

    @Test
    void approveLeaveDeductsBalanceAndMarksApproved() {
        User employee = employee();
        User reviewer = admin();
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .id(200L)
                .employee(employee)
                .startDate(LocalDate.now().plusDays(3))
                .endDate(LocalDate.now().plusDays(5))
                .daysRequested(3)
                .reason("Family travel")
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        when(leaveRequestRepository.findById(200L)).thenReturn(Optional.of(leaveRequest));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LeaveResponse response = leaveService.approve(200L, reviewer, "Approved");

        assertThat(response.getStatus()).isEqualTo(LeaveStatus.APPROVED);
        assertThat(employee.getLeaveBalance()).isEqualTo(9);
        assertThat(response.getReviewNote()).isEqualTo("Approved");
    }

    @Test
    void approveLeaveRejectsNegativeBalance() {
        User employee = employee();
        employee.setLeaveBalance(1);
        User reviewer = admin();
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .id(300L)
                .employee(employee)
                .startDate(LocalDate.now().plusDays(3))
                .endDate(LocalDate.now().plusDays(5))
                .daysRequested(3)
                .reason("Family travel")
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        when(leaveRequestRepository.findById(300L)).thenReturn(Optional.of(leaveRequest));

        assertThatThrownBy(() -> leaveService.approve(300L, reviewer, "Approved"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Leave balance cannot become negative");
    }

    private LeaveApplyRequest buildRequest(LocalDate start, LocalDate end, String reason) {
        LeaveApplyRequest request = new LeaveApplyRequest();
        request.setStartDate(start);
        request.setEndDate(end);
        request.setReason(reason);
        return request;
    }

    private User employee() {
        return User.builder()
                .id(2L)
                .name("Ava Employee")
                .email("employee@smartleave.test")
                .password("encoded")
                .role(Role.ROLE_EMPLOYEE)
                .leaveBalance(12)
                .department("Engineering")
                .position("Software Engineer")
                .active(true)
                .build();
    }

    private User admin() {
        return User.builder()
                .id(1L)
                .name("Admin User")
                .email("admin@smartleave.test")
                .password("encoded")
                .role(Role.ROLE_ADMIN)
                .leaveBalance(0)
                .department("Operations")
                .position("Administrator")
                .active(true)
                .build();
    }
}