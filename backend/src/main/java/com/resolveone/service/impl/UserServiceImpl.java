package com.resolveone.service.impl;

import com.resolveone.dto.request.RegisterRequest;
import com.resolveone.dto.response.RegisterResponse;
import com.resolveone.entity.User;
import com.resolveone.repository.UserRepository;
import com.resolveone.service.UserService;
import org.springframework.stereotype.Service;

import com.resolveone.enums.Role;
import com.resolveone.exception.UserAlreadyExistsException;

import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public RegisterResponse registerStudent(RegisterRequest request) {

        if (userRepository.existsByCollegeId(request.getCollegeId())) {
            throw new UserAlreadyExistsException("College ID already registered.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered.");
        }

        User user = new User();

        user.setCollegeId(request.getCollegeId());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // For now, plain text password.
        // Next lesson we'll use BCrypt.
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setDepartment(request.getDepartment());
        user.setSection(request.getSection());

        user.setRole(Role.STUDENT);

        user.setActive(true);

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getCollegeId(),
                savedUser.getEmail(),
                "Registration Successful"
        );
    }

}