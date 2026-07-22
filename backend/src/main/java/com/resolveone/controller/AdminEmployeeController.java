package com.resolveone.controller;
import com.resolveone.dto.request.ResetPasswordRequest;
import com.resolveone.dto.request.CreateEmployeeRequest;
import com.resolveone.dto.request.UpdateEmployeeRequest;
import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.EmployeeResponse;
import com.resolveone.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/admin/employees")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminEmployeeController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<EmployeeResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {

        EmployeeResponse employee =
                userService.createEmployee(request);

        return ApiResponse.success(
                "Employee created successfully",
                employee
        );
    }

    @GetMapping
    public ApiResponse<List<EmployeeResponse>> getAllEmployees() {

        return ApiResponse.success(
                "Employees fetched successfully",
                userService.getAllEmployees()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<EmployeeResponse> getEmployeeById(
            @PathVariable Long id) {

        return ApiResponse.success(
                "Employee fetched successfully",
                userService.getEmployeeById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest request) {

        return ApiResponse.success(
                "Employee updated successfully",
                userService.updateEmployee(id, request)
        );
    }

    @PatchMapping("/{id}/disable")
    public ApiResponse<EmployeeResponse> disableEmployee(
            @PathVariable Long id) {

        return ApiResponse.success(
                "Employee disabled successfully",
                userService.disableEmployee(id)
        );
    }

    @PatchMapping("/{id}/enable")
    public ApiResponse<EmployeeResponse> enableEmployee(
            @PathVariable Long id) {

        return ApiResponse.success(
                "Employee enabled successfully",
                userService.enableEmployee(id)
        );
    }

    @PatchMapping("/{id}/reset-password")
    public ApiResponse<EmployeeResponse> resetPassword(
            @PathVariable Long id,
            @Valid @RequestBody ResetPasswordRequest request) {

        return ApiResponse.success(
                "Password reset successfully",
                userService.resetEmployeePassword(id, request)
        );
    }
}