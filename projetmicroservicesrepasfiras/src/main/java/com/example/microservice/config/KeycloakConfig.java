package com.example.microservice.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Bean
    public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
        return new KeycloakSpringBootConfigResolver();
    }

    @Bean
    public KeycloakClientRequestFactory keycloakClientRequestFactory() {
        return new KeycloakClientRequestFactory();
    }

    @Bean
    public KeycloakRestTemplate keycloakRestTemplate(KeycloakClientRequestFactory factory) {
        return new KeycloakRestTemplate(factory);
    }

    private static Keycloak keycloak = null;
    private static final String SERVER_URL = "http://localhost:8080";
    private static final String REALM = "RepasKeycloak";
    private static final String CLIENT_ID = "repas-service";
    private static final String CLIENT_SECRET = "xELXqoDJ4DRmBxdlQqDn6a9trwNh8Wjq";

    public static Keycloak getInstance() {
        if (keycloak == null) {
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(SERVER_URL)
                    .realm(REALM)
                    .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                    .clientId(CLIENT_ID)
                    .clientSecret(CLIENT_SECRET)
                    .build();
        }
        return keycloak;
    }
}