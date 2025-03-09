package org.example.controller;

import org.example.model.Class;
import org.example.model.User;
import org.example.repository.ClassRepository;
import org.example.service.JwtService;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

    private final ClassRepository classRepository;
    private final JwtService jwtService;
    private final UserService userService;

    @Autowired
    public ClassController(ClassRepository classRepository, JwtService jwtService, UserService userService) {
        this.classRepository = classRepository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')") // ADMIN también puede crear
    public ResponseEntity<Class> createClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @RequestBody Class newClass) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        if (user.getRole() == User.Role.PROFESOR) {
            newClass.setProfessor(user); // El profesor creador es el que hace la petición
        } else if (newClass.getProfessor() == null) {
            throw new IllegalArgumentException("Admin must specify a professor for the class");
        }
        Class savedClass = classRepository.save(newClass);
        return ResponseEntity.ok(savedClass);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    public ResponseEntity<List<Class>> getClasses(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        if (user.getRole() == User.Role.ADMIN) {
            return ResponseEntity.ok(classRepository.findAll());
        } else {
            return ResponseEntity.ok(classRepository.findByProfessorId(user.getId()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    public ResponseEntity<Class> getClassById(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to this class");
        }
        return ResponseEntity.ok(classObj);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')") // ADMIN también puede actualizar
    public ResponseEntity<Class> updateClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id,
            @RequestBody Class updatedClass) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this class");
        }
        classObj.setName(updatedClass.getName());
        classObj.setCode(updatedClass.getCode());
        classObj.setDescription(updatedClass.getDescription());
        Class savedClass = classRepository.save(classObj);
        return ResponseEntity.ok(savedClass);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    public ResponseEntity<Void> deleteClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this class");
        }
        classRepository.delete(classObj);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')") // ADMIN también puede añadir estudiantes
    public ResponseEntity<Class> addStudentToClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id,
            @RequestBody StudentRequest studentRequest) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to modify this class");
        }
        User student = userService.getUserById(studentRequest.studentId());
        if (student.getRole() != User.Role.ALUMNO) {
            throw new IllegalArgumentException("Only students can be added to classes");
        }
        List<User> students = classObj.getStudents();
        if (students == null) {
            students = new java.util.ArrayList<>();
            classObj.setStudents(students);
        }
        if (!students.contains(student)) {
            students.add(student);
            classRepository.save(classObj);
        }
        return ResponseEntity.ok(classObj);
    }

    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    public ResponseEntity<List<User>> getStudentsInClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to this class");
        }
        return ResponseEntity.ok(classObj.getStudents() != null ? classObj.getStudents() : List.of());
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')") // ADMIN también puede quitar estudiantes
    public ResponseEntity<Class> removeStudentFromClass(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
            @PathVariable Long id,
            @PathVariable Long studentId) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email);
        Class classObj = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        if (user.getRole() != User.Role.ADMIN && !classObj.getProfessor().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to modify this class");
        }
        User student = userService.getUserById(studentId);
        List<User> students = classObj.getStudents();
        if (students != null && students.remove(student)) {
            classRepository.save(classObj);
        }
        return ResponseEntity.ok(classObj);
    }
}

record StudentRequest(Long studentId) {}