package com.resolveone.service;

import com.resolveone.dto.request.CreateStaffRequest;
import com.resolveone.dto.response.StaffResponse;

import java.util.List;

public interface StaffService {

    StaffResponse createStaff(CreateStaffRequest request);

    List<StaffResponse> getEligibleStaff(Long complaintId);
}