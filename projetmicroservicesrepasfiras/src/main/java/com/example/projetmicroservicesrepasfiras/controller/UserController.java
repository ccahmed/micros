package com.example.projetmicroservicesrepasfiras.controller;

import com.example.projetmicroservicesrepasfiras.Entity.User;
import com.example.projetmicroservicesrepasfiras.service.UserService;
import com.example.projetmicroservicesrepasfiras.service.PDFService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PDFService pdfService;

    @GetMapping
    @PreAuthorize("@userSecurity.hasUserId(authentication, #id)")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {
            // Get the authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.findByEmail(auth.getName());
            
            // Check if the user is trying to update someone else's profile by changing the email
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(currentUser.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot change the email to another user's email. You can only update your own profile.");
            }
            
            // Ensure the email remains the same as the authenticated user
            updatedUser.setEmail(currentUser.getEmail());
            
            // Update the authenticated user's profile
            User updatedProfile = userService.updateUser(currentUser.getId(), updatedUser);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating profile: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("@userSecurity.hasUserId(authentication, #id)")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@userSecurity.hasUserId(authentication, #id)")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body("User deleted successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }

    @GetMapping("/download-pdf")
    @PreAuthorize("@userSecurity.hasUserId(authentication, #id)")
    public ResponseEntity<byte[]> downloadUsersPDF() {
        List<User> users = userService.getAllUsers();
        byte[] pdfBytes = pdfService.generateUsersPDF(users);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "users-list.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}