package com.resolveone.service.impl;
import com.resolveone.dto.request.CreateEmployeeRequest;
import com.resolveone.dto.response.EmployeeResponse;
import com.resolveone.exception.UserAlreadyExistsException;
import com.resolveone.dto.request.RegisterRequest;
import com.resolveone.dto.response.RegisterResponse;
import com.resolveone.entity.User;
import com.resolveone.repository.UserRepository;
import com.resolveone.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.resolveone.enums.Role;
import com.resolveone.mapper.EmployeeMapper;
import com.resolveone.exception.UserAlreadyExistsException;
import com.resolveone.exception.EmployeeNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.resolveone.dto.request.UpdateEmployeeRequest;
import com.resolveone.exception.EmployeeNotFoundException;
import java.util.List;
import com.resolveone.dto.request.ResetPasswordRequest;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeMapper employeeMapper;
    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           EmployeeMapper employeeMapper) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.employeeMapper = employeeMapper;
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


    @Override
    @Transactional
    public EmployeeResponse createEmployee(
            CreateEmployeeRequest request) {


        if (userRepository.existsByCollegeId(
                request.getCollegeId())) {

            throw new UserAlreadyExistsException(
                    "College ID already exists"
            );
        }

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new UserAlreadyExistsException(
                    "Email already exists"
            );
        }

        if (request.getPhoneNumber() != null
                && !request.getPhoneNumber().isBlank()
                && userRepository.existsByPhoneNumber(request.getPhoneNumber().trim())) {

            throw new UserAlreadyExistsException(
                    "Phone number already exists"
            );
        }

        User employee = new User();

        employee.setFullName(request.getFullName().trim());
        employee.setCollegeId(request.getCollegeId().trim());

        employee.setEmail(
                request.getEmail()
                        .trim()
                        .toLowerCase()
        );

        employee.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        employee.setRole(request.getRole());

        employee.setDepartment(
                request.getDepartment()
        );

        employee.setResponsibleDepartment(
                request.getResponsibleDepartment()
        );

        employee.setSection(
                request.getSection()
        );

        employee.setPhoneNumber(
                request.getPhoneNumber()
        );

        employee.setActive(true);

        User savedEmployee =
                userRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {

        return userRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {

        User employee = userRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        return employeeMapper.toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(
            Long id,
            UpdateEmployeeRequest request) {

        User employee = userRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmailAndIdNot(email, id)) {
            throw new UserAlreadyExistsException(
                    "Email already exists"
            );
        }

        employee.setFullName(
                request.getFullName().trim()
        );

        employee.setEmail(email);

        employee.setRole(
                request.getRole()
        );

        employee.setDepartment(
                request.getDepartment()
        );

        employee.setResponsibleDepartment(
                request.getResponsibleDepartment()
        );

        employee.setSection(
                request.getSection()
        );

        employee.setPhoneNumber(
                request.getPhoneNumber()
        );

        User updatedEmployee =
                userRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }



    @Override
    @Transactional
    public EmployeeResponse disableEmployee(Long id) {

        User employee = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        employee.setActive(false);

        User updatedEmployee = userRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

    @Override
    @Transactional
    public EmployeeResponse enableEmployee(Long id) {

        User employee = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        employee.setActive(true);

        User updatedEmployee = userRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

    @Override
    @Transactional
    public EmployeeResponse resetEmployeePassword(
            Long id,
            ResetPasswordRequest request) {

        User employee = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));

        employee.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword().trim()
                )
        );

        User updatedEmployee =
                userRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

}