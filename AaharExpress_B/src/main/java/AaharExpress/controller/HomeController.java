package AaharExpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("name", "AaharExpress Backend API");
        payload.put("status", "OK");
        payload.put("message", "API is running. Refer to /api/** endpoints for functionality.");
        return ResponseEntity.ok(payload);
    }
}

