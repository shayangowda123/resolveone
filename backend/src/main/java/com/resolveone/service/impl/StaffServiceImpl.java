package com.resolveone.service.impl;

import com.resolveone.dto.request.CreateStaffRequest;
import com.resolveone.dto.response.StaffResponse;
import com.resolveone.entity.Complaint;
import com.resolveone.entity.User;
import com.resolveone.enums.Role;
import com.resolveone.exception.ComplaintNotFoundException;
import com.resolveone.exception.UserAlreadyExistsException;
import com.resolveone.repository.ComplaintRepository;
import com.resolveone.repository.UserRepository;
import com.resolveone.service.StaffService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffServiceImpl(
            UserRepository userRepository,
            ComplaintRepository complaintRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public StaffResponse createStaff(
            CreateStaffRequest request) {

        if (userRepository.existsByCollegeId(
                request.getCollegeId())) {

            throw new UserAlreadyExistsException(
                    "College ID already exists"
            );
        }

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new UserAlreadyExistsException(
                    "Email already exists"
            );
        }

        User staff = new User();

        staff.setFullName(request.getFullName().trim());
        staff.setCollegeId(request.getCollegeId().trim());
        staff.setEmail(
                request.getEmail().trim().toLowerCase()
        );

        staff.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        staff.setRole(Role.STAFF);
        staff.setDepartment(request.getDepartment());

        staff.setResponsibleDepartment(
                request.getResponsibleDepartment()
        );

        staff.setActive(true);

        User savedStaff = userRepository.save(staff);

        return mapToResponse(savedStaff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getEligibleStaff(
            Long complaintId) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        return userRepository
                .findByRoleAndResponsibleDepartment(
                        Role.STAFF,
                        complaint.getResponsibleDepartment()
                )
                .stream()
                .filter(User::isEnabled)
                .map(this::mapToResponse)
                .toList();
    }

    private StaffResponse mapToResponse(User staff) {

        StaffResponse response = new StaffResponse();

        response.setId(staff.getId());
        response.setFullName(staff.getFullName());
        response.setCollegeId(staff.getCollegeId());
        response.setEmail(staff.getEmail());
        response.setRole(staff.getRole());
        response.setDepartment(staff.getDepartment());

        response.setResponsibleDepartment(
                staff.getResponsibleDepartment()
        );

        response.setActive(staff.getActive());

        return response;
    }
}