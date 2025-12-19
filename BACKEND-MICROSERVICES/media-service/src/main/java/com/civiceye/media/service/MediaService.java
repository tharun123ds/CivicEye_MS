package com.civiceye.media.service;

import com.civiceye.media.entity.Media;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface MediaService {
    Media uploadFile(MultipartFile file, Long complaintId);
    Optional<Media> getMediaById(Long id);
    List<Media> getMediaByComplaintId(Long complaintId);
    Resource downloadFile(Long id);
    void deleteMedia(Long id);
}
