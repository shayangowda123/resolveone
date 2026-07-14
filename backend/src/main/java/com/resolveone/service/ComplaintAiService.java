package com.resolveone.service;

import com.resolveone.dto.response.ComplaintAnalysisResult;

public interface ComplaintAiService {

    ComplaintAnalysisResult analyzeComplaint(
            String title,
            String description
    );
}