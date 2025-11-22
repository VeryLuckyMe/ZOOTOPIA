package com.ccdjmv.petshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@SpringBootApplication
public class PetshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetshopApplication.class, args);
		System.out.println("PETSHOP: Connection Successful.");
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return (WebMvcConfigurer) new WebMvcConfigurer() {
			 public void addCorsMappings(CorsRegistry registry) {
			        registry.addMapping("/api/**") // Allow CORS for all API routes
			                .allowedOrigins("http://localhost:5173/") 
			                .allowedMethods("GET", "POST", "PUT", "DELETE")
			                .allowedHeaders("*")
			                .allowCredentials(true);
			    }
		};
	}
	    

}
