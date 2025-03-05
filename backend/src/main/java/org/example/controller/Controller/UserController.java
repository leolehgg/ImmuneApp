package org.example.controller.Controller;

import org.example.model.User;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }




    @GetMapping("/list")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers(); // Usamos el servicio para obtener los usuarios
        return ResponseEntity.ok(users); // Retornamos los usuarios como respuesta
    }
}
