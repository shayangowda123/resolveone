package com.resolveone.dto.response;

import com.resolveone.enums.Department;
import com.resolveone.enums.ResponsibleDepartment;
import com.resolveone.enums.Role;

public class EmployeeResponse {

    private Long id;

    private String fullName;

    private String collegeId;

    private String email;

    private Role role;

    private Department department;

    private ResponsibleDepartment responsibleDepartment;

    private Character section;

    private String phoneNumber;

    private Boolean active;

    // ---------- Getters & Setters ----------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public Character getSection() {
        return section;
    }

    public void setSection(Character section) {
        this.section = section;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}