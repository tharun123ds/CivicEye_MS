package com.civiceye.complaint.repository;

import com.civiceye.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Complaint Repository
 * Data access layer for Complaint entity
 */
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    /**
     * Find complaints by user ID
     */
    List<Complaint> findByUserId(Long userId);

    /**
     * Find complaints by status
     */
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);

    /**
     * Find complaints by category
     */
    List<Complaint> findByCategory(String category);

    /**
     * Find complaints by user ID and status
     */
    List<Complaint> findByUserIdAndStatus(Long userId, Complaint.ComplaintStatus status);
}
