package com.resolveone.service;

import com.resolveone.dto.request.RegisterRequest;
import com.resolveone.entity.User;

import com.resolveone.dto.response.RegisterResponse;

public interface UserService {

    RegisterResponse registerStudent(RegisterRequest request);

}