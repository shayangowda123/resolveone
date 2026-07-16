package com.resolveone.service;

import com.resolveone.dto.request.CreateComplaintRequest;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.dto.response.StaffResponse;

import java.util.List;

public interface ComplaintService {

    ComplaintResponse createComplaint(
            CreateComplaintRequest request,
            String authenticatedUserEmail
    );


    List<ComplaintResponse> getMyComplaints(
            String authenticatedUserEmail
    );


    ComplaintResponse getComplaintById(
            Long complaintId,
            String authenticatedUserEmail
    );

    List<ComplaintResponse> getDepartmentComplaints(
            String authenticatedUserEmail
    );

    List<ComplaintResponse> getAllComplaints();


    ComplaintResponse assignComplaintToSelf(
            Long complaintId,
            String authenticatedUserEmail
    );

    ComplaintResponse startComplaintProgress(
            Long complaintId,
            String authenticatedUserEmail
    );

    ComplaintResponse resolveComplaint(
            Long complaintId,
            String authenticatedUserEmail
    );

    ComplaintResponse escalateComplaint(
            Long complaintId
    );
    List<ComplaintResponse> getEscalatedComplaints();

    List<StaffResponse> getEligibleStaff(
            Long complaintId
    );
    ComplaintResponse assignComplaintToStaff(
            Long complaintId,
            Long staffId
    );


}