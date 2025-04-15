package com.example.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient  // Permet à Eureka d'enregistrer le service
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service-auth", r -> r.path("/auth/**")
                        .uri("lb://projetmicroservicesrepasfiras"))
                .route("user-service-api", r -> r.path("/api/**")
                        .uri("lb://projetmicroservicesrepasfiras"))
                .route("product", r -> r.path("/product/**")
                        .uri("http://localhost:8086/"))
                .route("productCategory", r -> r.path("/productCategory/**")
                        .uri("http://localhost:8086/"))
                .route("fournisseurs", r -> r.path("/fournisseurs/**")
                        .uri("http://localhost:8085/"))
                .route("produit-fournisseurs", r -> r.path("/produit-fournisseurs/**")
                        .uri("http://localhost:8085/"))
                .route("facture", r -> r.path("/Facture/**")
                        .uri("http://localhost:8082/"))
                .route("reclamations", r -> r.path("/reclamations/**")
                        .uri("http://localhost:8081/"))
                .build();
    }

}
