package com.resolveone.service;

import com.resolveone.entity.Complaint;

public interface EscalationNotificationService {

    void notifyEscalation(Complaint complaint);
}