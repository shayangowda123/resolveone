package com.resolveone.service;

import com.resolveone.dto.request.CreateEmployeeRequest;
import com.resolveone.dto.request.RegisterRequest;
import com.resolveone.dto.request.ResetPasswordRequest;
import com.resolveone.dto.request.UpdateEmployeeRequest;
import com.resolveone.dto.response.EmployeeResponse;
import com.resolveone.dto.response.RegisterResponse;

import java.util.List;

public interface UserService {
    EmployeeResponse disableEmployee(Long id);

    EmployeeResponse enableEmployee(Long id);
    RegisterResponse registerStudent(RegisterRequest request);
    EmployeeResponse getEmployeeById(Long id);
    EmployeeResponse createEmployee(
            CreateEmployeeRequest request
    );

    EmployeeResponse updateEmployee(
            Long id,
            UpdateEmployeeRequest request
    );

    EmployeeResponse resetEmployeePassword(
            Long id,
            ResetPasswordRequest request
    );

    List<EmployeeResponse> getAllEmployees();
}