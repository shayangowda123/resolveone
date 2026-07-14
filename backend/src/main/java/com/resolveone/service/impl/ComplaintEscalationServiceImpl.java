package com.resolveone.service.impl;

import com.resolveone.entity.Complaint;
import com.resolveone.enums.ComplaintStatus;
import com.resolveone.repository.ComplaintRepository;
import com.resolveone.service.ComplaintEscalationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.resolveone.service.EscalationNotificationService;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintEscalationServiceImpl
        implements ComplaintEscalationService {

    private final ComplaintRepository complaintRepository;
    private final EscalationNotificationService escalationNotificationService;

    public ComplaintEscalationServiceImpl(
            ComplaintRepository complaintRepository,
            EscalationNotificationService escalationNotificationService) {

        this.complaintRepository = complaintRepository;
        this.escalationNotificationService =
                escalationNotificationService;
    }

    @Override
    @Transactional
    public void processOverdueComplaints() {

        LocalDateTime currentTime = LocalDateTime.now();

        List<ComplaintStatus> activeStatuses = List.of(
                ComplaintStatus.OPEN,
                ComplaintStatus.ASSIGNED,
                ComplaintStatus.IN_PROGRESS
        );

        List<Complaint> overdueComplaints =
                complaintRepository
                        .findBySlaDeadlineBeforeAndStatusIn(
                                currentTime,
                                activeStatuses
                        );

        for (Complaint complaint : overdueComplaints) {

            complaint.setStatus(
                    ComplaintStatus.ESCALATED
            );

            complaint.setEscalationCount(
                    complaint.getEscalationCount() + 1
            );

            complaint.setEscalatedAt(currentTime);

            try {

                escalationNotificationService
                        .notifyEscalation(complaint);

            } catch (Exception exception) {

                System.err.println(
                        "Failed to send escalation notification "
                                + "for complaint ID: "
                                + complaint.getId()
                                + ". Reason: "
                                + exception.getMessage()
                );
            }
        }
    }
}