package com.resolveone.controller;

import com.resolveone.dto.request.LoginRequest;
import com.resolveone.dto.request.RegisterRequest;
import com.resolveone.dto.response.ApiResponse;
import com.resolveone.dto.response.LoginResponse;
import com.resolveone.dto.response.RegisterResponse;
import com.resolveone.service.AuthenticationService;
import com.resolveone.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    public AuthController(
            UserService userService,
            AuthenticationService authenticationService) {

        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> registerStudent(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse registerResponse =
                userService.registerStudent(request);

        ApiResponse<RegisterResponse> response =
                ApiResponse.success(
                        "User registered successfully",
                        registerResponse
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse loginResponse =
                authenticationService.login(request);

        ApiResponse<LoginResponse> response =
                ApiResponse.success(
                        "Login successful",
                        loginResponse
                );

        return ResponseEntity.ok(response);
    }
}