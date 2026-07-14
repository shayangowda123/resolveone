package com.resolveone.dto.response;

public class RegisterResponse {

    private Long id;
    private String fullName;
    private String collegeId;
    private String email;
    private String message;

    public RegisterResponse() {
    }

    public RegisterResponse(Long id,
                            String fullName,
                            String collegeId,
                            String email,
                            String message) {

        this.id = id;
        this.fullName = fullName;
        this.collegeId = collegeId;
        this.email = email;
        this.message = message;
    }

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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}