package com.resolveone.service.impl;

import com.resolveone.dto.response.ComplaintAnalysisResult;
import com.resolveone.exception.AiAnalysisException;
import com.resolveone.service.ComplaintAiService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ComplaintAiServiceImpl implements ComplaintAiService {

    private final ChatClient chatClient;

    public ComplaintAiServiceImpl(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public ComplaintAnalysisResult analyzeComplaint(
            String title,
            String description) {

        try {

            ComplaintAnalysisResult result = chatClient
                    .prompt()
                    .system("""
                        You are the AI complaint classification engine
                        for a college complaint management system named ResolveOne.

                        Analyze the student's complaint using its meaning and context.

                        Allowed category values:
                        INFRASTRUCTURE,
                        ELECTRICAL,
                        WATER,
                        SANITATION,
                        NETWORK,
                        ACADEMIC,
                        TRANSPORT,
                        HOSTEL,
                        CANTEEN,
                        SECURITY,
                        OTHER

                        Allowed priority values:
                        LOW,
                        MEDIUM,
                        HIGH,
                        CRITICAL

                        Allowed responsibleDepartment values:
                        FACILITIES,
                        ELECTRICAL_MAINTENANCE,
                        PLUMBING,
                        HOUSEKEEPING,
                        IT_SUPPORT,
                        ACADEMIC_AFFAIRS,
                        TRANSPORT_OFFICE,
                        HOSTEL_ADMINISTRATION,
                        CANTEEN_MANAGEMENT,
                        CAMPUS_SECURITY,
                        GENERAL_ADMINISTRATION

                        Priority rules:
                        LOW means minor inconvenience with little immediate impact.
                        MEDIUM means a meaningful issue affecting normal activity.
                        HIGH means serious disruption, repeated impact, or significant risk.
                        CRITICAL means immediate danger to health, life, or physical safety.

                        Routing rules:
                        Infrastructure issues route to FACILITIES.
                        Electrical issues route to ELECTRICAL_MAINTENANCE.
                        Water and plumbing issues route to PLUMBING.
                        Sanitation issues route to HOUSEKEEPING.
                        Network and technology issues route to IT_SUPPORT.
                        Academic issues route to ACADEMIC_AFFAIRS.
                        Transport issues route to TRANSPORT_OFFICE.
                        Hostel issues route to HOSTEL_ADMINISTRATION.
                        Canteen issues route to CANTEEN_MANAGEMENT.
                        Security issues route to CAMPUS_SECURITY.
                        Unclear general issues route to GENERAL_ADMINISTRATION.

                        summary must be a concise professional summary
                        of the complaint.

                        reason must briefly explain why the selected category,
                        priority, and responsible department are appropriate.

                        Never invent facts not present in the complaint.
                        Return only the requested structured result.
                        """)
                    .user(user -> user
                            .text("""
                                Complaint title:
                                {title}

                                Complaint description:
                                {description}
                                """)
                            .param("title", title)
                            .param("description", description)
                    )
                    .call()
                    .entity(ComplaintAnalysisResult.class);

            validateResult(result);

            return result;

        } catch (Exception ex) {
            ex.printStackTrace();
            throw new AiAnalysisException(
                    "Unable to analyze complaint using AI",
                    ex
            );
        }
    }

    private void validateResult(ComplaintAnalysisResult result) {

        if (result == null) {
            throw new IllegalStateException(
                    "AI returned an empty complaint analysis"
            );
        }

        if (result.getCategory() == null) {
            throw new IllegalStateException(
                    "AI did not return a valid complaint category"
            );
        }

        if (result.getPriority() == null) {
            throw new IllegalStateException(
                    "AI did not return a valid complaint priority"
            );
        }

        if (result.getResponsibleDepartment() == null) {
            throw new IllegalStateException(
                    "AI did not return a valid responsible department"
            );
        }

        if (result.getSummary() == null
                || result.getSummary().isBlank()) {

            throw new IllegalStateException(
                    "AI did not return a complaint summary"
            );
        }

        if (result.getReason() == null
                || result.getReason().isBlank()) {

            throw new IllegalStateException(
                    "AI did not return a classification reason"
            );
        }
    }
}