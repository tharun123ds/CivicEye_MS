package com.civiceye.media.controller;

import com.civiceye.media.entity.Media;
import com.civiceye.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Slf4j
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("complaintId") Long complaintId) {
        try {
            log.info("Received file upload request for complaint: {}", complaintId);
            Media media = mediaService.uploadFile(file, complaintId);
            return ResponseEntity.status(HttpStatus.CREATED).body(media);
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMediaById(@PathVariable Long id) {
        try {
            Media media = mediaService.getMediaById(id)
                    .orElseThrow(() -> new RuntimeException("Media not found with ID: " + id));
            return ResponseEntity.ok(media);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            Media media = mediaService.getMediaById(id)
                    .orElseThrow(() -> new RuntimeException("Media not found"));
            Resource resource = mediaService.downloadFile(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(media.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + media.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<List<Media>> getMediaByComplaintId(@PathVariable Long complaintId) {
        log.info("Fetching media for complaint: {}", complaintId);
        List<Media> mediaList = mediaService.getMediaByComplaintId(complaintId);
        return ResponseEntity.ok(mediaList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedia(@PathVariable Long id) {
        try {
            mediaService.deleteMedia(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Media deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
