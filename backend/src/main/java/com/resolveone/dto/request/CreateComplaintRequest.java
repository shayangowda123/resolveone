package com.resolveone.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateComplaintRequest {

    @NotBlank(message = "Complaint title is required")
    @Size(
            min = 5,
            max = 150,
            message = "Complaint title must be between 5 and 150 characters"
    )
    private String title;

    @NotBlank(message = "Complaint description is required")
    @Size(
            min = 20,
            max = 5000,
            message = "Complaint description must be between 20 and 5000 characters"
    )
    private String description;


    @NotBlank(message = "Building is required")
    @Size(max = 100, message = "Building must not exceed 100 characters")
    private String building;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}