package com.resolveone.service;

import com.resolveone.enums.ComplaintPriority;

import java.time.LocalDateTime;

public interface SlaService {

    LocalDateTime calculateDeadline(
            ComplaintPriority priority,
            LocalDateTime startTime
    );
}