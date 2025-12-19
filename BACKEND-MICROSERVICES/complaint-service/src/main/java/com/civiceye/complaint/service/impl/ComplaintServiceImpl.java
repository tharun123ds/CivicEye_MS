package com.civiceye.complaint.service.impl;

import com.civiceye.complaint.dto.UserDTO;
import com.civiceye.complaint.entity.Complaint;
import com.civiceye.complaint.repository.ComplaintRepository;
import com.civiceye.complaint.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

/**
 * Complaint Service Implementation
 * Implements business logic with inter-service communication using RestTemplate
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://USER-SERVICE/api/users";
    private static final String NOTIFICATION_SERVICE_URL = "http://NOTIFICATION-SERVICE/api/notifications";

    @Override
    public Complaint createComplaint(Complaint complaint) {
        log.info("Creating new complaint for user ID: {}", complaint.getUserId());

        // Validate user exists by calling User Service via RestTemplate
        try {
            String url = USER_SERVICE_URL + "/" + complaint.getUserId();
            log.info("Calling User Service at: {}", url);
            
            UserDTO user = restTemplate.getForObject(url, UserDTO.class);
            
            if (user == null) {
                throw new RuntimeException("User not found with ID: " + complaint.getUserId());
            }
            
            log.info("User validated: {} ({})", user.getUsername(), user.getEmail());
        } catch (Exception e) {
            log.error("Error validating user: {}", e.getMessage());
            throw new RuntimeException("Failed to validate user: " + e.getMessage());
        }

        Complaint savedComplaint = complaintRepository.save(complaint);
        log.info("Complaint created successfully with ID: {}", savedComplaint.getId());

        // Create notification for user (async call to Notification Service)
        createNotificationForUser(complaint.getUserId(), savedComplaint.getId(), 
            "Your complaint '" + savedComplaint.getTitle() + "' has been submitted successfully.");

        return savedComplaint;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Complaint> getComplaintById(Long id) {
        log.info("Fetching complaint by ID: {}", id);
        return complaintRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        log.info("Fetching all complaints");
        return complaintRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByUserId(Long userId) {
        log.info("Fetching complaints for user ID: {}", userId);
        return complaintRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByStatus(Complaint.ComplaintStatus status) {
        log.info("Fetching complaints by status: {}", status);
        return complaintRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByCategory(String category) {
        log.info("Fetching complaints by category: {}", category);
        return complaintRepository.findByCategory(category);
    }

    @Override
    public Complaint updateComplaint(Long id, Complaint complaint) {
        log.info("Updating complaint with ID: {}", id);

        Complaint existingComplaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        // Update fields
        if (complaint.getTitle() != null) {
            existingComplaint.setTitle(complaint.getTitle());
        }
        if (complaint.getDescription() != null) {
            existingComplaint.setDescription(complaint.getDescription());
        }
        if (complaint.getCategory() != null) {
            existingComplaint.setCategory(complaint.getCategory());
        }
        if (complaint.getLatitude() != null) {
            existingComplaint.setLatitude(complaint.getLatitude());
        }
        if (complaint.getLongitude() != null) {
            existingComplaint.setLongitude(complaint.getLongitude());
        }
        if (complaint.getAddress() != null) {
            existingComplaint.setAddress(complaint.getAddress());
        }

        Complaint updatedComplaint = complaintRepository.save(existingComplaint);
        log.info("Complaint updated successfully: {}", updatedComplaint.getId());
        return updatedComplaint;
    }

    @Override
    public Complaint updateComplaintStatus(Long id, Complaint.ComplaintStatus status) {
        log.info("Updating complaint status for ID: {} to {}", id, status);

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

        Complaint.ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(status);

        Complaint updatedComplaint = complaintRepository.save(complaint);
        log.info("Complaint status updated from {} to {}", oldStatus, status);

        // Notify user about status change via Notification Service
        createNotificationForUser(complaint.getUserId(), complaint.getId(),
            "Your complaint '" + complaint.getTitle() + "' status changed to: " + status);

        return updatedComplaint;
    }

    @Override
    public void deleteComplaint(Long id) {
        log.info("Deleting complaint with ID: {}", id);

        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Complaint not found with ID: " + id);
        }

        complaintRepository.deleteById(id);
        log.info("Complaint deleted successfully: {}", id);
    }

    /**
     * Helper method to create notification via Notification Service
     */
    private void createNotificationForUser(Long userId, Long complaintId, String message) {
        try {
            log.info("Creating notification for user {} about complaint {}", userId, complaintId);
            
            // Create notification DTO
            var notification = new java.util.HashMap<String, Object>();
            notification.put("userId", userId);
            notification.put("complaintId", complaintId);
            notification.put("message", message);
            notification.put("type", "COMPLAINT_UPDATE");
            notification.put("isRead", false);

            restTemplate.postForObject(NOTIFICATION_SERVICE_URL, notification, Object.class);
            log.info("Notification created successfully");
        } catch (Exception e) {
            // Don't fail the main operation if notification fails
            log.error("Failed to create notification: {}", e.getMessage());
        }
    }
}
