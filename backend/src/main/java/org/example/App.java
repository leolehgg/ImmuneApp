package org.example;

import org.example.model.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class App implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Verificando existencia de admin...");
            if (userRepository.findByRole(User.Role.ADMIN).isEmpty()) {
                User admin = User.builder()
                        .name("Admin")
                        .lastname("Initial")
                        .email("admin@university.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin inicial creado: admin@university.com / admin123 - ¡Cambia la contraseña!");
            } else {
                System.out.println("Ya existe un admin en la base de datos.");
            }
        } catch (Exception e) {
            System.err.println("Error al crear admin inicial: " + e.getMessage());
            e.printStackTrace();
        }
    }
}