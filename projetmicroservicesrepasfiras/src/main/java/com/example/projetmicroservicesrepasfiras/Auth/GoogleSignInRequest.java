package com.example.projetmicroservicesrepasfiras.Auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleSignInRequest {
    private String idToken;
} 