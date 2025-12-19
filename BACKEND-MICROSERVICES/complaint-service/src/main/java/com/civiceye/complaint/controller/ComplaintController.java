package com.civiceye.complaint.controller;

import com.civiceye.complaint.entity.Complaint;
import com.civiceye.complaint.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Complaint Controller
 * REST API endpoints for complaint operations
 */
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Slf4j
public class ComplaintController {

    private final ComplaintService complaintService;

    /**
     * Create a new complaint
     * POST /api/complaints
     */
    @PostMapping
    public ResponseEntity<?> createComplaint(@Valid @RequestBody Complaint complaint) {
        try {
            log.info("Received request to create complaint for user: {}", complaint.getUserId());
            Complaint createdComplaint = complaintService.createComplaint(complaint);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComplaint);
        } catch (Exception e) {
            log.error("Error creating complaint: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get complaint by ID
     * GET /api/complaints/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        try {
            log.info("Received request to get complaint by ID: {}", id);
            Complaint complaint = complaintService.getComplaintById(id)
                    .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
            return ResponseEntity.ok(complaint);
        } catch (Exception e) {
            log.error("Error fetching complaint: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get all complaints
     * GET /api/complaints
     */
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        
        log.info("Received request to get all complaints (status: {}, category: {})", status, category);
        
        List<Complaint> complaints;
        
        if (status != null) {
            complaints = complaintService.getComplaintsByStatus(Complaint.ComplaintStatus.valueOf(status));
        } else if (category != null) {
            complaints = complaintService.getComplaintsByCategory(category);
        } else {
            complaints = complaintService.getAllComplaints();
        }
        
        return ResponseEntity.ok(complaints);
    }

    /**
     * Get complaints by user ID
     * GET /api/complaints/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByUserId(@PathVariable Long userId) {
        log.info("Received request to get complaints for user: {}", userId);
        List<Complaint> complaints = complaintService.getComplaintsByUserId(userId);
        return ResponseEntity.ok(complaints);
    }

    /**
     * Update complaint
     * PUT /api/complaints/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComplaint(@PathVariable Long id, @RequestBody Complaint complaint) {
        try {
            log.info("Received request to update complaint: {}", id);
            Complaint updatedComplaint = complaintService.updateComplaint(id, complaint);
            return ResponseEntity.ok(updatedComplaint);
        } catch (Exception e) {
            log.error("Error updating complaint: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Update complaint status
     * PUT /api/complaints/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            log.info("Received request to update complaint status: {}", id);
            String statusStr = statusUpdate.get("status");
            Complaint.ComplaintStatus status = Complaint.ComplaintStatus.valueOf(statusStr);
            
            Complaint updatedComplaint = complaintService.updateComplaintStatus(id, status);
            return ResponseEntity.ok(updatedComplaint);
        } catch (Exception e) {
            log.error("Error updating complaint status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete complaint
     * DELETE /api/complaints/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        try {
            log.info("Received request to delete complaint: {}", id);
            complaintService.deleteComplaint(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Complaint deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting complaint: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
