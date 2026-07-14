package com.resolveone.service;

public interface EmailService {

    void sendEmail(
            String recipient,
            String subject,
            String body
    );
}