package com.resolveone.controller;

import com.resolveone.dto.request.CreateStaffRequest;
import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.StaffResponse;
import com.resolveone.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StaffService staffService;

    public AdminController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping("/staff")
    public ApiResponse<StaffResponse> createStaff(
            @Valid @RequestBody CreateStaffRequest request) {

        StaffResponse staff =
                staffService.createStaff(request);

        return ApiResponse.success(
                "Staff account created successfully",
                staff
        );
    }

    @GetMapping("/complaints/{complaintId}/eligible-staff")
    public ApiResponse<List<StaffResponse>> getEligibleStaff(
            @PathVariable Long complaintId) {

        List<StaffResponse> staff =
                staffService.getEligibleStaff(complaintId);

        return ApiResponse.success(
                "Eligible staff retrieved successfully",
                staff
        );
    }
}