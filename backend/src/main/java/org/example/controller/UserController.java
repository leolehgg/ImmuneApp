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
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        System.out.println("Recibida solicitud GET para usuario con ID: " + id);
        User user = userService.getUserById(id);
        System.out.println("Usuario encontrado: " + user.getEmail());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        System.out.println("Recibida solicitud DELETE para usuario con ID: " + id);
        userService.deleteUser(id);
        System.out.println("Usuario eliminado con éxito: " + id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7); // Quita "Bearer "
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
}