package com.smartleave.controller;

import com.smartleave.dto.LeaveApplyRequest;
import com.smartleave.dto.LeaveResponse;
import com.smartleave.dto.ProfileResponse;
import com.smartleave.dto.UpdateProfileRequest;
import com.smartleave.service.EmployeeService;
import com.smartleave.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final LeaveService leaveService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> profile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employeeService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(employeeService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employeeService.getDashboard(userDetails.getUsername()));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponse>> myLeaves(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.getMyLeaves(userDetails.getUsername()));
    }

    @PostMapping("/leaves")
    public ResponseEntity<LeaveResponse> applyLeave(@AuthenticationPrincipal UserDetails userDetails,
                                                    @Valid @RequestBody LeaveApplyRequest request) {
        return ResponseEntity.ok(leaveService.applyLeave(userDetails.getUsername(), request));
    }

    @PatchMapping("/leaves/{leaveId}/cancel")
    public ResponseEntity<LeaveResponse> cancelLeave(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long leaveId) {
        return ResponseEntity.ok(leaveService.cancelLeave(userDetails.getUsername(), leaveId));
    }
}