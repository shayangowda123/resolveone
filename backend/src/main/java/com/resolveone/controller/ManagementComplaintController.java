package com.resolveone.controller;
import org.springframework.web.bind.annotation.PatchMapping;
import com.resolveone.dto.response.StaffResponse;
import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.service.ComplaintService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
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
        System.out.println("INSIDE ESCALATED API");
        List<ComplaintResponse> complaints =
                complaintService.getEscalatedComplaints();

        return ApiResponse.success(
                "Escalated complaints retrieved successfully",
                complaints
        );
    }


    @GetMapping("/{complaintId}")
    public ApiResponse<ComplaintResponse> getComplaintById(
            @PathVariable Long complaintId,
            Authentication authentication
    ) {

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

    @GetMapping("/{complaintId}/eligible-staff")
    public ApiResponse<List<StaffResponse>>
    getEligibleStaff(
            @PathVariable Long complaintId) {

        return ApiResponse.success(
                "Eligible staff retrieved successfully",
                complaintService.getEligibleStaff(
                        complaintId
                )
        );
    }


    @PatchMapping("/{complaintId}/assign/{staffId}")
    public ApiResponse<ComplaintResponse> assignComplaintToStaff(
            @PathVariable Long complaintId,
            @PathVariable Long staffId
    ) {

        ComplaintResponse complaint =
                complaintService.assignComplaintToStaff(
                        complaintId,
                        staffId
                );

        return ApiResponse.success(
                "Complaint assigned successfully",
                complaint
        );
    }
}