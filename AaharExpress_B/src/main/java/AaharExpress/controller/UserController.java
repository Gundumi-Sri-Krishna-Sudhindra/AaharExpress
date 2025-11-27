package AaharExpress.controller;

import AaharExpress.model.User;
import AaharExpress.service.UserService;
import AaharExpress.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        java.util.Optional<User> userOpt = userService.getUserByUsername(authentication.getName());
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();
        // Basic DTO for safety
        java.util.Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("id", user.getId());
        dto.put("username", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("fullName", user.getFullName());
        return ResponseEntity.ok(dto);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Optional<User> userOptional = userService.getUserById(id);
        
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }
        
        if (updates.containsKey("mobileNumber")) {
            user.setMobileNumber(updates.get("mobileNumber"));
        }
        
        if (updates.containsKey("address")) {
            user.setAddress(updates.get("address"));
        }
        
        userService.updateUser(user);
        
        return ResponseEntity.ok(new MessageResponse("User details updated successfully!"));
    }
    
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminUpdateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Optional<User> userOptional = userService.getUserById(id);
        
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }
        
        if (updates.containsKey("mobileNumber")) {
            user.setMobileNumber(updates.get("mobileNumber"));
        }
        
        if (updates.containsKey("address")) {
            user.setAddress(updates.get("address"));
        }
        
        // Additional fields that only admin can update
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
        }
        
        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }
        
        userService.updateUser(user);
        
        return ResponseEntity.ok(new MessageResponse("User details updated successfully by admin!"));
    }
}
