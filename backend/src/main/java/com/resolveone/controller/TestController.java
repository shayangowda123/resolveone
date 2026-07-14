package com.resolveone.controller;

import com.resolveone.dto.response.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/protected")
    public ApiResponse<String> protectedEndpoint(
            Authentication authentication) {

        return ApiResponse.success(
                "JWT authentication successful",
                "Authenticated user: " + authentication.getName()
        );
    }
}