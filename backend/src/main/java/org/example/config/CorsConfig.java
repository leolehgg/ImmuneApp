package org.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Rutas públicas
                registry.addMapping("/auth/login")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("POST", "OPTIONS") // Añadir OPTIONS
                        .allowedHeaders("Content-Type")
                        .allowCredentials(false);

                registry.addMapping("/auth/register")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("POST", "OPTIONS") // Añadir OPTIONS
                        .allowedHeaders("Content-Type")
                        .allowCredentials(false);

                // Rutas protegidas
                registry.addMapping("/auth/refresh")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("POST", "OPTIONS") // Añadir OPTIONS
                        .allowedHeaders("Authorization", "Content-Type")
                        .allowCredentials(false);

                registry.addMapping("/auth/logout")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("POST", "OPTIONS") // Añadir OPTIONS
                        .allowedHeaders("Authorization", "Content-Type")
                        .allowCredentials(false);

                registry.addMapping("/users/list")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "OPTIONS") // Añadir OPTIONS aquí
                        .allowedHeaders("Authorization", "Content-Type")
                        .allowCredentials(false);

                registry.addMapping("/api/protected")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "OPTIONS") // Añadir OPTIONS
                        .allowedHeaders("Authorization", "Content-Type")
                        .allowCredentials(false);
            }
        };
    }
}