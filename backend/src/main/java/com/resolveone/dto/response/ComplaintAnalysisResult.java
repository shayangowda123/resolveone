package com.resolveone.dto.response;

import com.resolveone.enums.ComplaintCategory;
import com.resolveone.enums.ComplaintPriority;
import com.resolveone.enums.ResponsibleDepartment;

public class ComplaintAnalysisResult {

    private ComplaintCategory category;
    private ComplaintPriority priority;
    private ResponsibleDepartment responsibleDepartment;
    private String summary;
    private String reason;

    public ComplaintAnalysisResult() {
    }

    public ComplaintCategory getCategory() {
        return category;
    }

    public void setCategory(ComplaintCategory category) {
        this.category = category;
    }

    public ComplaintPriority getPriority() {
        return priority;
    }

    public void setPriority(ComplaintPriority priority) {
        this.priority = priority;
    }

    public ResponsibleDepartment getResponsibleDepartment() {
        return responsibleDepartment;
    }

    public void setResponsibleDepartment(
            ResponsibleDepartment responsibleDepartment) {
        this.responsibleDepartment = responsibleDepartment;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}