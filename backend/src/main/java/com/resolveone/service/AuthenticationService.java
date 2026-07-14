package com.resolveone.service;

import com.resolveone.dto.request.LoginRequest;
import com.resolveone.dto.response.LoginResponse;

public interface AuthenticationService {

    LoginResponse login(LoginRequest request);

}