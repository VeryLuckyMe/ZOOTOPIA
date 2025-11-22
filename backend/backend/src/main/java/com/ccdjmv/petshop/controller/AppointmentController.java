package com.ccdjmv.petshop.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.ccdjmv.petshop.entity.AppointmentEntity;
import com.ccdjmv.petshop.service.AppointmentService;

@CrossOrigin(origins = "http://localhost:5173") // Enable CORS for this controller
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/getAppointment")
    public List<AppointmentEntity> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

//    @GetMapping("/getAppointment")
//    public ResponseEntity<AppointmentEntity> getAppointmentById(@PathVariable String appId) {
//        return appointmentService.getAppointmentById(appId)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
    
     
    @PostMapping("/postAppointment")
    public AppointmentEntity addAppointment(@RequestBody AppointmentEntity appointment) {
        return appointmentService.addAppointment(appointment);
    }

    @PutMapping("/putAppointment/{appid}")
    public AppointmentEntity updateAppointment(@PathVariable int appid,@RequestBody AppointmentEntity appointment) {
        return appointmentService.updateAppointment(appid, appointment);
    }
    
    @DeleteMapping("/deleteAppointment/{appid}")
    public String deleteCourse(@PathVariable int appid) {
        return appointmentService.deleteAppointment(appid);
    }
    
//    @GetMapping("/getAppointmentsByUser/{email}")
//    public ResponseEntity<List<AppointmentEntity>> getAppointmentsByUser(@PathVariable String email) {
//        List<AppointmentEntity> appointments = appointmentService.findByEmail(email);
//        return ResponseEntity.ok(appointments);
//    }
    
    @PutMapping("/cancel/{appid}")
    public ResponseEntity<String> cancelAppointment(@PathVariable int appid) {
        // Find the appointment by appid
        AppointmentEntity appointment = appointmentService.getAppointmentById(appid); // Ensure this method exists in your service

        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
        }

        // Update the canceled flag to true
        appointment.setCanceled(true);

        // Save the updated appointment to the database
        String response = appointmentService.updateAppointment(appointment); // Ensure you have a method to update the appointment

        if (response.equals("Appointment successfully updated.")) {
            return ResponseEntity.ok("Appointment successfully canceled.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel appointment.");
        }
    }
    
    @PutMapping("/confirm/{appid}")
    public ResponseEntity<String> confirmAppointment(@PathVariable int appid) {
        // Find the appointment by appid
        AppointmentEntity appointment = appointmentService.getAppointmentById(appid);

        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
        }

        // Check if the appointment has already been confirmed
        if (appointment.isConfirmed()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Appointment is already confirmed.");
        }

        // Update the confirmed flag to true
        appointment.setConfirmed(true);

        // Save the updated appointment to the database
        String response = appointmentService.updateAppointment(appointment);

        if (response.equals("Appointment successfully updated.")) {
            return ResponseEntity.ok("Appointment successfully confirmed.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to confirm appointment.");
        }
    }

    @GetMapping("/byUserEmail/{email}")
    public List<AppointmentEntity> getAppointmentsByUserEmail(@PathVariable String email) {
        return appointmentService.getAppointmentsByUserEmail(email);
    }

}