package AaharExpress.controller;

import AaharExpress.model.ERole;
import AaharExpress.model.Role;
import AaharExpress.model.User;
import AaharExpress.payload.request.LoginRequest;
import AaharExpress.payload.request.SignupRequest;
import AaharExpress.payload.response.JwtResponse;
import AaharExpress.payload.response.MessageResponse;
import AaharExpress.repository.RoleRepository;
import AaharExpress.repository.UserRepository;
import AaharExpress.security.jwt.JwtUtils;
import AaharExpress.security.services.UserDetailsImpl;
import AaharExpress.service.UserService;
import AaharExpress.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "${app.cors.allowed-origins}", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @Autowired
    EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 userDetails.getId(), 
                                                 userDetails.getUsername(), 
                                                 userDetails.getEmail(),
                                                 userDetails.getFullName(),
                                                 userDetails.getMobileNumber(),
                                                 userDetails.getAddress(),
                                                 userDetails.getMemberSince(),
                                                 roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                             signUpRequest.getEmail(),
                             encoder.encode(signUpRequest.getPassword()));

        // Set additional user details
        user.setFullName(signUpRequest.getFullName());
        user.setMobileNumber(signUpRequest.getMobileNumber());
        user.setAddress(signUpRequest.getAddress());

        Set<String> strRoles = signUpRequest.getRequestedRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Assign default USER role if none specified
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_USER)));
            roles.add(userRole);
        } else {
            for (String roleReq : strRoles) {
                String normalized = roleReq.trim().toUpperCase();

                // Allow both 'ROLE_DELIVERY_AGENT' and 'DELIVERY_AGENT', etc.
                ERole selectedEnum = null;
                for (ERole e : ERole.values()) {
                    if (normalized.equals(e.name()) || normalized.equals(e.name().replace("ROLE_", ""))) {
                        selectedEnum = e;
                        break;
                    }
                }
                if (selectedEnum == null) {
                    selectedEnum = ERole.ROLE_USER; // fallback
                }
                // Fetch or create role
                Role dbRole;
                java.util.Optional<Role> dbRoleOpt = roleRepository.findByName(selectedEnum);
                if (dbRoleOpt.isPresent()) {
                    dbRole = dbRoleOpt.get();
                } else {
                    dbRole = roleRepository.save(new Role(selectedEnum));
                }
                roles.add(dbRole);
            }
        }
        user.setRoles(roles);
        userRepository.save(user);

        // Log which roles were assigned
        StringBuilder sb = new StringBuilder();
        for (Role r : roles) {
            sb.append(r.getName().name()).append(", ");
        }
        System.out.println("User registered with roles: " + sb.toString());

        // Send welcome email to the new user
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername(), user.getFullName());

        // Confirm registration with assigned roles
        java.util.List<String> roleNames = new java.util.ArrayList<>();
        for (Role r : roles) roleNames.add(r.getName().name());
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("message", "User registered successfully!");
        resp.put("username", user.getUsername());
        resp.put("roles", roleNames);
        return ResponseEntity.ok(resp);
    }
    
    // Debug endpoint to get user details by username
    @GetMapping("/user-details/{username}")
    public ResponseEntity<?> getUserDetails(@PathVariable String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("passwordLength", user.getPassword().length());
            response.put("passwordHash", user.getPassword());
            response.put("fullName", user.getFullName());
            response.put("mobileNumber", user.getMobileNumber());
            response.put("address", user.getAddress());
            response.put("memberSince", user.getMemberSince());
            response.put("roles", user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Debug endpoint to test password matching
    @PostMapping("/test-password")
    public ResponseEntity<?> testPasswordMatch(@RequestParam String username, @RequestParam String rawPassword) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            boolean matches = encoder.matches(rawPassword, user.getPassword());
            
            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("passwordMatches", matches);
            response.put("storedPasswordHash", user.getPassword());
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        boolean result = userService.forgotPassword(email);
        
        if (result) {
            return ResponseEntity.ok(new MessageResponse("Password recovery email sent successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email not found!"));
        }
    }
} 