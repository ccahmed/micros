package com.example.projetmicroservicesrepasfiras.Auth;


import com.example.projetmicroservicesrepasfiras.Entity.User;
import com.example.projetmicroservicesrepasfiras.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authenticationService.login(request));
    }



    @Value("${welcome.message}")
    private String welcomeMessage;

    @GetMapping("/welcome")
    public ResponseEntity<List<User>> welcome() {
        return ResponseEntity.ok(userService.getAllUsers());

    }

    @Value("${welcome.message}")
    private String helloMessage;

    @GetMapping("/hello")
    public String hello() {
        return helloMessage;
    }



}
