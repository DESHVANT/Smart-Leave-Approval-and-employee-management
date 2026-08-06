package com.smartleave.controller;

import com.smartleave.dto.*;
import com.smartleave.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeSummaryResponse>> employees() {
        return ResponseEntity.ok(adminService.getEmployees());
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponse>> allLeaves() {
        return ResponseEntity.ok(adminService.getAllLeaves());
    }

    @PatchMapping("/leaves/{leaveId}/approve")
    public ResponseEntity<LeaveResponse> approveLeave(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable Long leaveId,
                                                      @Valid @RequestBody AdminDecisionRequest request) {
        return ResponseEntity.ok(adminService.approveLeave(userDetails.getUsername(), leaveId, request));
    }

    @PatchMapping("/leaves/{leaveId}/reject")
    public ResponseEntity<LeaveResponse> rejectLeave(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long leaveId,
                                                     @Valid @RequestBody AdminDecisionRequest request) {
        return ResponseEntity.ok(adminService.rejectLeave(userDetails.getUsername(), leaveId, request));
    }

    @PatchMapping("/employees/{employeeId}/balance")
    public ResponseEntity<ProfileResponse> adjustBalance(@PathVariable Long employeeId,
                                                         @Valid @RequestBody BalanceAdjustmentRequest request) {
        return ResponseEntity.ok(adminService.adjustBalance(employeeId, request));
    }
}