package com.resolveone.service.impl;
import com.resolveone.service.SlaService;
import com.resolveone.dto.request.CreateComplaintRequest;
import com.resolveone.dto.response.ComplaintAnalysisResult;
import com.resolveone.dto.response.ComplaintResponse;
import com.resolveone.entity.Complaint;
import com.resolveone.entity.User;
import com.resolveone.enums.ComplaintStatus;
import com.resolveone.exception.ComplaintNotFoundException;
import com.resolveone.repository.ComplaintRepository;
import com.resolveone.repository.UserRepository;
import com.resolveone.service.ComplaintAiService;
import com.resolveone.service.ComplaintService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintAiService complaintAiService;
    private final SlaService slaService;

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            ComplaintAiService complaintAiService,
            SlaService slaService) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.complaintAiService = complaintAiService;
        this.slaService = slaService;
    }

    @Override
    public ComplaintResponse createComplaint(
            CreateComplaintRequest request,
            String authenticatedUserEmail) {

        User user = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found"
                        )
                );

        ComplaintAnalysisResult analysis =
                complaintAiService.analyzeComplaint(
                        request.getTitle(),
                        request.getDescription()
                );

        Complaint complaint = new Complaint();

        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());

        complaint.setBuilding(
                request.getBuilding().trim()
        );

        complaint.setLocation(
                request.getLocation().trim()
        );

        complaint.setCategory(analysis.getCategory());
        complaint.setPriority(analysis.getPriority());

        complaint.setResponsibleDepartment(
                analysis.getResponsibleDepartment()
        );

        complaint.setAiSummary(analysis.getSummary());
        complaint.setAiReason(analysis.getReason());

        complaint.setStatus(ComplaintStatus.OPEN);

        complaint.setSlaDeadline(
                slaService.calculateDeadline(
                        analysis.getPriority(),
                        java.time.LocalDateTime.now()
                )
        );
        complaint.setCreatedBy(user);

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(
            String authenticatedUserEmail) {

        User user = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found"
                        )
                );

        return complaintRepository
                .findByCreatedByOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(
            Long complaintId,
            String authenticatedUserEmail) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        if (!complaint.getCreatedBy()
                .getEmail()
                .equals(authenticatedUserEmail)) {

            throw new ComplaintNotFoundException(
                    "Complaint not found with id: "
                            + complaintId
            );
        }

        return mapToResponse(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getDepartmentComplaints(
            String authenticatedUserEmail) {

        User staff = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated staff user not found"
                        )
                );

        if (staff.getResponsibleDepartment() == null) {
            throw new IllegalStateException(
                    "Staff user is not assigned to a responsible department"
            );
        }

        return complaintRepository
                .findByResponsibleDepartmentOrderByCreatedAtDesc(
                        staff.getResponsibleDepartment()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getEscalatedComplaints() {

        return complaintRepository
                .findByStatusOrderByCreatedAtDesc(
                        ComplaintStatus.ESCALATED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    @Transactional
    public ComplaintResponse assignComplaintToSelf(
            Long complaintId,
            String authenticatedUserEmail) {

        User staff = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated staff user not found"
                        )
                );

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        if (staff.getResponsibleDepartment() == null) {
            throw new IllegalStateException(
                    "Staff user is not assigned to a responsible department"
            );
        }

        if (!staff.getResponsibleDepartment()
                .equals(complaint.getResponsibleDepartment())) {

            throw new IllegalStateException(
                    "You cannot assign a complaint from another department"
            );
        }

        if (complaint.getAssignedTo() != null) {
            throw new IllegalStateException(
                    "Complaint is already assigned"
            );
        }

        if (complaint.getStatus() != ComplaintStatus.OPEN) {
            throw new IllegalStateException(
                    "Only OPEN complaints can be assigned"
            );
        }

        complaint.setAssignedTo(staff);
        complaint.setStatus(ComplaintStatus.ASSIGNED);

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }


    @Override
    @Transactional
    public ComplaintResponse startComplaintProgress(
            Long complaintId,
            String authenticatedUserEmail) {

        User staff = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated staff not found"
                        )
                );

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        if (complaint.getAssignedTo() == null) {
            throw new IllegalStateException(
                    "Complaint is not assigned to any staff"
            );
        }

        if (!complaint.getAssignedTo()
                .getId()
                .equals(staff.getId())) {

            throw new IllegalStateException(
                    "You are not assigned to this complaint"
            );
        }

        if (complaint.getStatus()
                != ComplaintStatus.ASSIGNED) {

            throw new IllegalStateException(
                    "Only assigned complaints can be started"
            );
        }

        complaint.setStatus(
                ComplaintStatus.IN_PROGRESS
        );

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    @Override
    @Transactional
    public ComplaintResponse resolveComplaint(
            Long complaintId,
            String authenticatedUserEmail) {

        User staff = userRepository
                .findByEmail(authenticatedUserEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated staff not found"
                        )
                );

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        if (complaint.getAssignedTo() == null) {
            throw new IllegalStateException(
                    "Complaint is not assigned to any staff"
            );
        }

        if (!complaint.getAssignedTo()
                .getId()
                .equals(staff.getId())) {

            throw new IllegalStateException(
                    "You are not assigned to this complaint"
            );
        }

        if (complaint.getStatus() != ComplaintStatus.IN_PROGRESS
                && complaint.getStatus() != ComplaintStatus.ESCALATED) {

            throw new IllegalStateException(
                    "Only complaints in progress or escalated complaints can be resolved"
            );
        }

        complaint.setStatus(
                ComplaintStatus.RESOLVED
        );

        complaint.setResolvedAt(
                java.time.LocalDateTime.now()
        );

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    @Override
    @Transactional
    public ComplaintResponse escalateComplaint(
            Long complaintId) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found with id: "
                                        + complaintId
                        )
                );

        if (complaint.getStatus() == ComplaintStatus.RESOLVED
                || complaint.getStatus() == ComplaintStatus.CLOSED
                || complaint.getStatus() == ComplaintStatus.REJECTED) {

            throw new IllegalStateException(
                    "Completed or rejected complaints cannot be escalated"
            );
        }

        complaint.setStatus(
                ComplaintStatus.ESCALATED
        );

        complaint.setEscalationCount(
                complaint.getEscalationCount() + 1
        );

        complaint.setEscalatedAt(
                java.time.LocalDateTime.now()
        );

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    private ComplaintResponse mapToResponse(
            Complaint complaint) {

        ComplaintResponse response =
                new ComplaintResponse();

        response.setId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());

        response.setBuilding(
                complaint.getBuilding()
        );

        response.setLocation(
                complaint.getLocation()
        );

        response.setCategory(complaint.getCategory());
        response.setPriority(complaint.getPriority());
        response.setStatus(complaint.getStatus());

        response.setResponsibleDepartment(
                complaint.getResponsibleDepartment()
        );

        response.setAiSummary(complaint.getAiSummary());
        response.setAiReason(complaint.getAiReason());

        response.setCreatedById(
                complaint.getCreatedBy().getId()
        );

        response.setCreatedByName(
                complaint.getCreatedBy().getFullName()
        );

        if (complaint.getAssignedTo() != null) {

            response.setAssignedToId(
                    complaint.getAssignedTo().getId()
            );

            response.setAssignedToName(
                    complaint.getAssignedTo().getFullName()
            );
        }

        response.setEscalationCount(
                complaint.getEscalationCount()
        );

        response.setEscalatedAt(
                complaint.getEscalatedAt()
        );

        response.setSlaDeadline(
                complaint.getSlaDeadline()
        );

        response.setResolvedAt(
                complaint.getResolvedAt()
        );

        response.setCreatedAt(
                complaint.getCreatedAt()
        );

        response.setUpdatedAt(
                complaint.getUpdatedAt()
        );

        return response;
    }
}