package com.resolveone.controller;

import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.service.ComplaintService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/complaints")
@PreAuthorize("hasAuthority('ROLE_STAFF')")
public class StaffComplaintController {

    private final ComplaintService complaintService;

    public StaffComplaintController(
            ComplaintService complaintService) {

        this.complaintService = complaintService;
    }

    @GetMapping
    public ApiResponse<List<ComplaintResponse>>
    getDepartmentComplaints(Authentication authentication) {

        List<ComplaintResponse> complaints =
                complaintService.getDepartmentComplaints(
                        authentication.getName()
                );

        return ApiResponse.success(
                "Department complaints retrieved successfully",
                complaints
        );
    }


    @PatchMapping("/{complaintId}/assign")
    public ApiResponse<ComplaintResponse> assignComplaintToSelf(
            @PathVariable Long complaintId,
            Authentication authentication) {

        ComplaintResponse complaint =
                complaintService.assignComplaintToSelf(
                        complaintId,
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaint assigned successfully",
                complaint
        );
    }

    @PatchMapping("/{complaintId}/start")
    public ApiResponse<ComplaintResponse> startComplaintProgress(
            @PathVariable Long complaintId,
            Authentication authentication) {

        ComplaintResponse complaint =
                complaintService.startComplaintProgress(
                        complaintId,
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaint work started successfully",
                complaint
        );
    }

    @PatchMapping("/{complaintId}/resolve")
    public ApiResponse<ComplaintResponse> resolveComplaint(
            @PathVariable Long complaintId,
            Authentication authentication) {

        ComplaintResponse complaint =
                complaintService.resolveComplaint(
                        complaintId,
                        authentication.getName()
                );

        return ApiResponse.success(
                "Complaint resolved successfully",
                complaint
        );
    }


    @PatchMapping("/{complaintId}/escalate")
    public ApiResponse<ComplaintResponse> escalateComplaint(
            @PathVariable Long complaintId) {

        ComplaintResponse complaint =
                complaintService.escalateComplaint(
                        complaintId
                );

        return ApiResponse.success(
                "Complaint escalated successfully",
                complaint
        );
    }

}