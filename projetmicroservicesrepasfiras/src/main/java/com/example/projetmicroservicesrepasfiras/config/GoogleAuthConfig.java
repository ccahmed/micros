package com.example.projetmicroservicesrepasfiras.config;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class GoogleAuthConfig {

    @Value("${google.clientId}")
    private String clientId;

//    @Bean
//    public GoogleIdTokenVerifier googleIdTokenVerifier() {
//        return new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
//                .setAudience(Collections.singletonList(clientId))
//                .build();
//    }
} 