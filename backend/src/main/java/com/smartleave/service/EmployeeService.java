package com.smartleave.service;

import com.smartleave.dto.ProfileResponse;
import com.smartleave.dto.UpdateProfileRequest;
import com.smartleave.exception.ResourceNotFoundException;
import com.smartleave.model.LeaveStatus;
import com.smartleave.model.User;
import com.smartleave.repository.LeaveRequestRepository;
import com.smartleave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public ProfileResponse getProfile(String email) {
        User user = getUser(email);
        return mapProfile(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = getUser(email);
        user.setName(request.getName().trim());
        user.setDepartment(request.getDepartment().trim());
        user.setPosition(request.getPosition().trim());
        user.setPhone(request.getPhone());
        return mapProfile(userRepository.save(user));
    }

    public ProfileResponse getDashboard(String email) {
        return getProfile(email);
    }

    private ProfileResponse mapProfile(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .position(user.getPosition())
                .phone(user.getPhone())
                .role(user.getRole())
                .leaveBalance(user.getLeaveBalance())
                .pendingLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.PENDING))
                .approvedLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.APPROVED))
                .rejectedLeaves(leaveRequestRepository.countByEmployeeAndStatus(user, LeaveStatus.REJECTED))
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}