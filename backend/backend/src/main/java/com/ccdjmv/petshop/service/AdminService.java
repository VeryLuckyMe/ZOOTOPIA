package com.ccdjmv.petshop.service;

import com.ccdjmv.petshop.entity.AdminEntity;
import com.ccdjmv.petshop.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    // Create or save an admin
    public AdminEntity saveAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    // Retrieve all admins
    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Retrieve an admin by ID
    public Optional<AdminEntity> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    // Delete an admin by ID
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    // Check login credentials (optional for authentication)
    public boolean validateAdmin(String user, String password) {
        return adminRepository.findByUserAndPassword(user, password).isPresent();
    }
    
    public Optional<AdminEntity> findByUserAndPassword(String user, String password) {
        return adminRepository.findByUserAndPassword(user, password);
    }

}
