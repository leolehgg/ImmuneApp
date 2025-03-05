package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Indica que esta clase es una configuración de Spring
public class CorsConfig {

    @Bean // Declara un bean para configurar CORS
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/auth/**") // Aplica CORS a todas las rutas que comiencen con "/api/"
                        .allowedOrigins("http://localhost:3000") // Permite peticiones solo desde el frontend en React (localhost:3000)
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Especifica qué métodos HTTP están permitidos
                        .allowCredentials(true); // Permite el uso de credenciales (cookies, headers de autenticación, etc.)
            }


        };
    }
}

