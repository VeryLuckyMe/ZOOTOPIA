package com.ccdjmv.petshop.controller;

import com.ccdjmv.petshop.entity.AdminEntity;
import com.ccdjmv.petshop.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:5173")
@Controller
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

 
    @GetMapping
    public String adminPage(Model model) {
        List<AdminEntity> admins = adminService.getAllAdmins();
        model.addAttribute("admins", admins);
        return "admin"; // Refers to the admin.html template
    }


    @PostMapping("/add")
    public ResponseEntity<String> addAdmin(@RequestBody AdminEntity admin) {
        adminService.saveAdmin(admin);
        return ResponseEntity.ok("Admin added successfully!");
    }


    @GetMapping("/{id}")
    public ResponseEntity<AdminEntity> getAdminById(@PathVariable Long id) {
        Optional<AdminEntity> admin = adminService.getAdminById(id);
        return admin.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("Admin deleted successfully!");
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestParam String user, @RequestParam String password) {
        Optional<AdminEntity> admin = adminService.findByUserAndPassword(user, password);
        if (admin.isPresent()) {
            return ResponseEntity.ok("Login successful!"); // Add a session/token mechanism for production
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

}
