package com.civiceye.media.service.impl;

import com.civiceye.media.entity.Media;
import com.civiceye.media.repository.MediaRepository;
import com.civiceye.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final RestTemplate restTemplate;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final String COMPLAINT_SERVICE_URL = "http://COMPLAINT-SERVICE/api/complaints";

    @Override
    public Media uploadFile(MultipartFile file, Long complaintId) {
        log.info("Uploading file for complaint ID: {}", complaintId);

        // Validate complaint exists via RestTemplate
        try {
            String url = COMPLAINT_SERVICE_URL + "/" + complaintId;
            log.info("Validating complaint at: {}", url);
            restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            log.error("Complaint validation failed: {}", e.getMessage());
            throw new RuntimeException("Complaint not found with ID: " + complaintId);
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create media record
            Media media = new Media();
            media.setComplaintId(complaintId);
            media.setFileName(originalFilename);
            media.setFileType(file.getContentType());
            media.setFileSize(file.getSize());
            media.setFileUrl(filePath.toString());

            Media savedMedia = mediaRepository.save(media);
            log.info("File uploaded successfully with ID: {}", savedMedia.getId());
            return savedMedia;

        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Media> getMediaById(Long id) {
        log.info("Fetching media by ID: {}", id);
        return mediaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Media> getMediaByComplaintId(Long complaintId) {
        log.info("Fetching media for complaint ID: {}", complaintId);
        return mediaRepository.findByComplaintId(complaintId);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadFile(Long id) {
        log.info("Downloading file with ID: {}", id);

        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + id));

        try {
            Path filePath = Paths.get(media.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable: " + media.getFileName());
            }
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage());
            throw new RuntimeException("Failed to download file: " + e.getMessage());
        }
    }

    @Override
    public void deleteMedia(Long id) {
        log.info("Deleting media with ID: {}", id);

        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + id));

        try {
            // Delete physical file
            Path filePath = Paths.get(media.getFileUrl());
            Files.deleteIfExists(filePath);

            // Delete database record
            mediaRepository.deleteById(id);
            log.info("Media deleted successfully: {}", id);
        } catch (IOException e) {
            log.error("Error deleting file: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
}
