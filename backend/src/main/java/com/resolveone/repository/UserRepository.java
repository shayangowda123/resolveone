package com.resolveone.repository;

import com.resolveone.entity.User;
import com.resolveone.enums.Department;
import com.resolveone.enums.ResponsibleDepartment;
import com.resolveone.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByCollegeId(String collegeId);

    Optional<User> findByEmail(String email);

    boolean existsByCollegeId(String collegeId);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);
    List<User> findByRoleAndResponsibleDepartment(
            Role role,
            ResponsibleDepartment responsibleDepartment
    );

    boolean existsByEmailAndIdNot(
            String email,
            Long id
    );

    // ===============================
    // Employee Management
    // ===============================

    List<User> findAllByOrderByCreatedAtDesc();

    List<User> findByRoleOrderByCreatedAtDesc(Role role);

    List<User> findByDepartmentOrderByCreatedAtDesc(Department department);

    Optional<User> findByIdAndActiveTrue(Long id);
}