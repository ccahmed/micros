package com.example.projetmicroservicesrepasfiras.Auth;

import com.example.projetmicroservicesrepasfiras.Entity.User;
import com.example.projetmicroservicesrepasfiras.repo.UserRepository;
import com.example.projetmicroservicesrepasfiras.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.authentication.BadCredentialsException;
import java.util.UUID;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // Create User entity
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        // Save user to repository
        userRepository.save(user);

        // Generate JWT token with Keycloak-like structure
        Map<String, Object> claims = new HashMap<>();
        
        // Add realm_access with roles
        Map<String, Object> realmAccess = new HashMap<>();
        realmAccess.put("roles", Arrays.asList(user.getRole().name(), "offline_access", "default-roles-repaskeycloak"));
        claims.put("realm_access", realmAccess);
        
        // Add resource_access
        Map<String, Object> resourceAccess = new HashMap<>();
        Map<String, Object> accountRoles = new HashMap<>();
        accountRoles.put("roles", Arrays.asList("manage-account", "view-profile"));
        resourceAccess.put("account", accountRoles);
        claims.put("resource_access", resourceAccess);
        
        // Add other standard claims
        claims.put("email_verified", false);
        claims.put("name", user.getFirstName() + " " + user.getLastName());
        claims.put("preferred_username", user.getUsername());
        claims.put("given_name", user.getFirstName());
        claims.put("family_name", user.getLastName());
        claims.put("email", user.getEmail());

        var jwtToken = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("User registered successfully")
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        // Generate JWT token with Keycloak-like structure
        Map<String, Object> claims = new HashMap<>();
        
        // Add role directly in claims for backward compatibility
        claims.put("role", user.getRole().name());
        
        // Add realm_access with roles
        Map<String, Object> realmAccess = new HashMap<>();
        List<String> roles = new ArrayList<>();
        roles.add(user.getRole().name());  // Add the main role first
        roles.add("offline_access");
        roles.add("default-roles-repaskeycloak");
        realmAccess.put("roles", roles);
        claims.put("realm_access", realmAccess);
        
        // Add resource_access
        Map<String, Object> resourceAccess = new HashMap<>();
        Map<String, Object> accountRoles = new HashMap<>();
        accountRoles.put("roles", Arrays.asList("manage-account", "view-profile"));
        resourceAccess.put("account", accountRoles);
        claims.put("resource_access", resourceAccess);
        
        // Add other standard claims
        claims.put("email_verified", false);
        claims.put("name", user.getFirstName() + " " + user.getLastName());
        claims.put("preferred_username", user.getUsername());
        claims.put("given_name", user.getFirstName());
        claims.put("family_name", user.getLastName());
        claims.put("email", user.getEmail());

        System.out.println("Generated claims for token: " + claims);  // Debug log
        String jwtToken = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful")
                .build();
    }



    private String generateRandomPassword() {
        return UUID.randomUUID().toString();
    }
}