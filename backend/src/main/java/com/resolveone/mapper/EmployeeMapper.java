package com.resolveone.mapper;

import com.resolveone.dto.response.EmployeeResponse;
import com.resolveone.entity.User;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        EmployeeResponse response = new EmployeeResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setCollegeId(user.getCollegeId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setDepartment(user.getDepartment());
        response.setResponsibleDepartment(user.getResponsibleDepartment());
        response.setSection(user.getSection());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setActive(user.getActive());

        return response;
    }
}