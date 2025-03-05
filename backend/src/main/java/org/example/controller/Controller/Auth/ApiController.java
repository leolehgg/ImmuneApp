package org.example.controller.Controller.Auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/protected")
    public ResponseEntity<String> getProtectedData() {
        return ResponseEntity.ok("Este es un recurso protegido que requiere autenticación.");
    }
}
