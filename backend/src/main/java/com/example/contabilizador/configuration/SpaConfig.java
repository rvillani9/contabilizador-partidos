package com.example.contabilizador.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Esta regla dice: "Si la ruta no tiene un punto (no es un archivo .js o .css)
        // y no es una ruta de API, mandalo al index.html del front"
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}