package com.civiceye.media.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long complaintId;

    @Column(nullable = false)
    private String fileName;

    private String fileType;

    private Long fileSize;

    @Column(nullable = false)
    private String fileUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
}
