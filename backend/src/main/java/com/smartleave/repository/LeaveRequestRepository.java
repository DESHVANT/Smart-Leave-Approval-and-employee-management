package com.smartleave.repository;

import com.smartleave.model.LeaveRequest;
import com.smartleave.model.LeaveStatus;
import com.smartleave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrderByCreatedAtDesc(User employee);
    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
    List<LeaveRequest> findByStatusInOrderByCreatedAtDesc(Collection<LeaveStatus> statuses);
    long countByStatus(LeaveStatus status);
    long countByEmployeeAndStatus(User employee, LeaveStatus status);
    boolean existsByEmployeeAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            User employee,
            Collection<LeaveStatus> statuses,
            LocalDate endDate,
            LocalDate startDate);
    boolean existsByEmployeeAndStartDateAndEndDateAndReasonIgnoreCaseAndStatusIn(
            User employee,
            LocalDate startDate,
            LocalDate endDate,
            String reason,
            Collection<LeaveStatus> statuses);
}