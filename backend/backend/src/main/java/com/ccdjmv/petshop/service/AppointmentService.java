package com.ccdjmv.petshop.service;

import java.util.List;
//import java.util.Optional;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccdjmv.petshop.entity.AppointmentEntity;
import com.ccdjmv.petshop.repository.AppointmentRepository;


@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    public AppointmentService() {
    	super();
    }
    //read
    public List<AppointmentEntity> getAllAppointments() {
        return appointmentRepository.findAll();
    }

//    public Optional<AppointmentEntity> getAppointmentById(String appId) {
//        return appointmentRepository.findById(appId);
//    }

    //create
    public AppointmentEntity addAppointment(AppointmentEntity appointment) {
        return appointmentRepository.save(appointment);
    }

    //update
    public AppointmentEntity updateAppointment(int appid,AppointmentEntity appointment) {
    	
    	AppointmentEntity existingAppointment = appointmentRepository.findById(appid)
                .orElseThrow(() -> new NoSuchElementException("Appointment with id " + appid + " not found"));

        // Update fields
//        existingAppointment.setCustomerId(appointment.getCustomerId());
        existingAppointment.setEmail(appointment.getEmail());
        existingAppointment.setContactNo(appointment.getContactNo());
        existingAppointment.setDate(appointment.getDate());
        

        return appointmentRepository.save(existingAppointment);
    }

   //delete
    public String deleteAppointment(int appid) {
    	 Optional<AppointmentEntity> appointment = appointmentRepository.findById(appid);
    	    
    	    if (appointment.isPresent()) {
    	        appointmentRepository.delete(appointment.get());
    	        return "Appointment successfully canceled.";
    	    } else {
    	        return "Appointment with ID " + appid + " not found.";
    	    }
    }
    
    //put
    public String updateAppointment(AppointmentEntity appointment) {
        try {
            appointmentRepository.save(appointment); // Save the updated appointment to the database
            return "Appointment successfully updated.";
        } catch (Exception e) {
            return "Error updating appointment: " + e.getMessage();
        }
    }
    
    public AppointmentEntity getAppointmentById(int appid) {
        return appointmentRepository.findById(appid).orElse(null); // Find the appointment by ID
    }
    
//    public List<AppointmentEntity> getAppointmentByUser(String email) {
//        return appointmentRepository.findByEmail(email);
//    }

//    public List<AppointmentEntity> findByEmail(String email) {
//        return appointmentRepository.findByEmailWithGrooming(email);
//    }
    
    
    public List<AppointmentEntity> getAppointmentsByUserEmail(String email) {
        return appointmentRepository.findByUserEmail(email);
    }
    
}
