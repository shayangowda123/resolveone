package com.resolveone.service.impl;

import com.resolveone.entity.Complaint;
import com.resolveone.enums.ResponsibleDepartment;
import com.resolveone.service.EmailService;
import com.resolveone.service.EscalationNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EscalationNotificationServiceImpl
        implements EscalationNotificationService {

    private final EmailService emailService;

    @Value("${notification.escalation.facilities-head}")
    private String facilitiesHeadEmail;

    @Value("${notification.escalation.it-head}")
    private String itHeadEmail;

    @Value("${notification.escalation.academic-head}")
    private String academicHeadEmail;

    @Value("${notification.escalation.transport-head}")
    private String transportHeadEmail;

    @Value("${notification.escalation.hostel-head}")
    private String hostelHeadEmail;

    @Value("${notification.escalation.canteen-head}")
    private String canteenHeadEmail;

    @Value("${notification.escalation.security-head}")
    private String securityHeadEmail;

    @Value("${notification.escalation.admin}")
    private String adminEmail;

    public EscalationNotificationServiceImpl(
            EmailService emailService) {

        this.emailService = emailService;
    }

    @Override
    public void notifyEscalation(Complaint complaint) {

        String recipient =
                determineEscalationRecipient(
                        complaint.getResponsibleDepartment()
                );

        String subject =
                "[ResolveOne SLA Escalation] "
                        + complaint.getPriority()
                        + " Priority Complaint #"
                        + complaint.getId();

        String body = buildEmailBody(complaint);

        emailService.sendEmail(
                recipient,
                subject,
                body
        );
    }

    private String determineEscalationRecipient(
            ResponsibleDepartment department) {

        if (department == null) {
            return adminEmail;
        }

        return switch (department) {

            case FACILITIES,
                 ELECTRICAL_MAINTENANCE,
                 PLUMBING,
                 HOUSEKEEPING
                    -> facilitiesHeadEmail;

            case IT_SUPPORT
                    -> itHeadEmail;

            case ACADEMIC_AFFAIRS
                    -> academicHeadEmail;

            case TRANSPORT_OFFICE
                    -> transportHeadEmail;

            case HOSTEL_ADMINISTRATION
                    -> hostelHeadEmail;

            case CANTEEN_MANAGEMENT
                    -> canteenHeadEmail;

            case CAMPUS_SECURITY
                    -> securityHeadEmail;

            case GENERAL_ADMINISTRATION
                    -> adminEmail;
        };
    }

    private String buildEmailBody(
            Complaint complaint) {

        return """
                ResolveOne Automatic SLA Escalation

                An unresolved complaint has exceeded its SLA deadline
                and has been automatically escalated.

                Complaint ID: %s
                Title: %s
                Priority: %s
                Responsible Department: %s
                Current Status: %s
                SLA Deadline: %s
                Escalated At: %s
                Escalation Count: %s

                Please review and take the necessary action.

                This is an automated notification from ResolveOne.
                """.formatted(
                complaint.getId(),
                complaint.getTitle(),
                complaint.getPriority(),
                complaint.getResponsibleDepartment(),
                complaint.getStatus(),
                complaint.getSlaDeadline(),
                complaint.getEscalatedAt(),
                complaint.getEscalationCount()
        );
    }
}