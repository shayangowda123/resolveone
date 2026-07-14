package com.resolveone.service.impl;

import com.resolveone.enums.ComplaintPriority;
import com.resolveone.service.SlaService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SlaServiceImpl implements SlaService {

    @Override
    public LocalDateTime calculateDeadline(
            ComplaintPriority priority,
            LocalDateTime startTime) {

        if (priority == null) {
            throw new IllegalArgumentException(
                    "Complaint priority cannot be null"
            );
        }

        if (startTime == null) {
            throw new IllegalArgumentException(
                    "SLA start time cannot be null"
            );
        }

        return switch (priority) {

            case CRITICAL ->
                    startTime.plusHours(2);

            case HIGH ->
                    startTime.plusHours(8);

            case MEDIUM ->
                    startTime.plusHours(24);

            case LOW ->
                    startTime.plusHours(72);
        };
    }
}