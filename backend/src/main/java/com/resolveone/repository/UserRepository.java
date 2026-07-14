package com.resolveone.repository;

import com.resolveone.entity.User;
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

    List<User> findByRoleAndResponsibleDepartment(
            Role role,
            ResponsibleDepartment responsibleDepartment
    );
}