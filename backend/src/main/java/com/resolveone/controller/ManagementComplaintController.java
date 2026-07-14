package com.resolveone.controller;

import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.service.ComplaintService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/management/complaints")
@PreAuthorize(
        "hasAnyAuthority(" +
                "'ROLE_HOD', " +
                "'ROLE_DEAN', " +
                "'ROLE_PRINCIPAL', " +
                "'ROLE_ADMIN'" +
                ")"
)
public class ManagementComplaintController {

    private final ComplaintService complaintService;

    public ManagementComplaintController(
            ComplaintService complaintService) {

        this.complaintService = complaintService;
    }

    @GetMapping("/escalated")
    public ApiResponse<List<ComplaintResponse>>
    getEscalatedComplaints() {

        List<ComplaintResponse> complaints =
                complaintService.getEscalatedComplaints();

        return ApiResponse.success(
                "Escalated complaints retrieved successfully",
                complaints
        );
    }
}