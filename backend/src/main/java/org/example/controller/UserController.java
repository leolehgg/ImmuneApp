package org.example.controller;

import org.example.controller.Auth.ChangePasswordRequest;
import org.example.model.User;
import org.example.service.JwtService;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')") // Profesor puede ver sus estudiantes
    public ResponseEntity<User> getUserById(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);
        User user = userService.getUserById(id);
        if (requester.getRole() == User.Role.PROFESOR && !user.getCreatedBy().getId().equals(requester.getId()) && user.getRole() != User.Role.ALUMNO) {
            throw new SecurityException("Unauthorized access to this user");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody UserRequest userRequest) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);
        User newUser = User.builder()
                .name(userRequest.name())
                .lastname(userRequest.lastname())
                .email(userRequest.email())
                .password(userRequest.password())
                .role(userRequest.role())
                .createdBy(requester)
                .build();
        User user = userService.createUser(newUser, requester.getRole().name());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/students")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')") // Admin también puede crear estudiantes
    public ResponseEntity<User> createStudent(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody UserRequest userRequest) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);
        User newStudent = User.builder()
                .name(userRequest.name())
                .lastname(userRequest.lastname())
                .email(userRequest.email())
                .password(userRequest.password())
                .role(User.Role.ALUMNO)
                .createdBy(requester)
                .build();
        User student = userService.createUser(newStudent, requester.getRole().name());
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')") // Profesor puede actualizar sus estudiantes
    public ResponseEntity<User> updateUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id,
            @RequestBody User updatedUser) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);
        User user = userService.getUserById(id);
        if (requester.getRole() == User.Role.PROFESOR) {
            if (!user.getCreatedBy().getId().equals(requester.getId()) || user.getRole() != User.Role.ALUMNO) {
                throw new SecurityException("Unauthorized to update this user");
            }
            user.setName(updatedUser.getName());
            user.setLastname(updatedUser.getLastname());
            user.setEmail(updatedUser.getEmail());
        } else {
            user = updatedUser; // Admin puede actualizar todo
        }
        User savedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')") // Profesor puede eliminar sus estudiantes
    public ResponseEntity<Void> deleteUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);
        User user = userService.getUserById(id);
        if (requester.getRole() == User.Role.PROFESOR && (!user.getCreatedBy().getId().equals(requester.getId()) || user.getRole() != User.Role.ALUMNO)) {
            throw new SecurityException("Unauthorized to delete this user");
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody User updatedUser) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        user.setName(updatedUser.getName());
        user.setLastname(updatedUser.getLastname());
        User savedUser = userService.updateUser(user.getId(), user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody ChangePasswordRequest request) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        try {
            userService.changePassword(email, request.oldPassword(), request.newPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // En UserController.java
    @GetMapping("/professors")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESOR')")
    public ResponseEntity<List<User>> getProfessors(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User requester = userService.getUserByEmail(email);

        if (requester.getRole() == User.Role.ADMIN) {
            return ResponseEntity.ok(userService.getUsersByRole(User.Role.PROFESOR));
        } else {
            // Si es profesor, solo devuelve su propia información
            return ResponseEntity.ok(Collections.singletonList(requester));
        }
    }


}

// Ajustar UserRequest para quitar classIds
record UserRequest(String name, String lastname, String email, String password, User.Role role) {}