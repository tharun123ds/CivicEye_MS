package com.civiceye.complaint.service;

import com.civiceye.complaint.entity.Complaint;

import java.util.List;
import java.util.Optional;

/**
 * Complaint Service Interface
 * Business logic for complaint operations
 */
public interface ComplaintService {

    /**
     * Create a new complaint
     */
    Complaint createComplaint(Complaint complaint);

    /**
     * Get complaint by ID
     */
    Optional<Complaint> getComplaintById(Long id);

    /**
     * Get all complaints
     */
    List<Complaint> getAllComplaints();

    /**
     * Get complaints by user ID
     */
    List<Complaint> getComplaintsByUserId(Long userId);

    /**
     * Get complaints by status
     */
    List<Complaint> getComplaintsByStatus(Complaint.ComplaintStatus status);

    /**
     * Get complaints by category
     */
    List<Complaint> getComplaintsByCategory(String category);

    /**
     * Update complaint
     */
    Complaint updateComplaint(Long id, Complaint complaint);

    /**
     * Update complaint status
     */
    Complaint updateComplaintStatus(Long id, Complaint.ComplaintStatus status);

    /**
     * Delete complaint
     */
    void deleteComplaint(Long id);
}
