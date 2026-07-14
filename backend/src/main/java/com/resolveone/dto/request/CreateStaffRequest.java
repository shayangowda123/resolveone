package com.resolveone.dto.request;

import com.resolveone.enums.Department;
import com.resolveone.enums.ResponsibleDepartment;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateStaffRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "College ID is required")
    private String collegeId;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    private Department department;

    @NotNull(message = "Responsible department is required")
    private ResponsibleDepartment responsibleDepartment;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public ResponsibleDepartment getResponsibleDepartment() {
        return responsibleDepartment;
    }

    public void setResponsibleDepartment(
            ResponsibleDepartment responsibleDepartment) {
        this.responsibleDepartment = responsibleDepartment;
    }
}