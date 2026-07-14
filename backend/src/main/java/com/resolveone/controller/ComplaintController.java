package com.resolveone.controller;

import com.resolveone.dto.request.CreateComplaintRequest;
import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(
            ComplaintService complaintService) {

        this.complaintService = complaintService;
    }

    @PostMapping
    public ApiResponse<ComplaintResponse> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            Authentication authentication) {

        ComplaintResponse response =
                complaintService.createComplaint(
                        request,
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaint created and analyzed successfully",
                response
        );
    }

    @GetMapping("/my")
    public ApiResponse<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication) {

        List<ComplaintResponse> complaints =
                complaintService.getMyComplaints(
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaints retrieved successfully",
                complaints
        );
    }

    @GetMapping("/{complaintId}")
    public ApiResponse<ComplaintResponse> getComplaintById(
            @PathVariable Long complaintId,
            Authentication authentication) {

        ComplaintResponse complaint =
                complaintService.getComplaintById(
                        complaintId,
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaint retrieved successfully",
                complaint
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<ComplaintResponse>> getAllComplaints() {

        List<ComplaintResponse> complaints =
                complaintService.getAllComplaints();

        return ApiResponse.success(
                "All complaints retrieved successfully",
                complaints
        );
    }

}