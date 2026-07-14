package com.resolveone.scheduler;

import com.resolveone.service.ComplaintEscalationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ComplaintEscalationScheduler {

    private final ComplaintEscalationService
            complaintEscalationService;

    public ComplaintEscalationScheduler(
            ComplaintEscalationService
                    complaintEscalationService) {

        this.complaintEscalationService =
                complaintEscalationService;
    }

    @Scheduled(fixedDelay = 60000)
    public void checkOverdueComplaints() {

        complaintEscalationService
                .processOverdueComplaints();
    }
}