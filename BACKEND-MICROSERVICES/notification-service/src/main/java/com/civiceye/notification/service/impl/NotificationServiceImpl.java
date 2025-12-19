package com.civiceye.notification.service.impl;

import com.civiceye.notification.entity.Notification;
import com.civiceye.notification.repository.NotificationRepository;
import com.civiceye.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://USER-SERVICE/api/users";

    @Override
    public Notification createNotification(Notification notification) {
        log.info("Creating notification for user ID: {}", notification.getUserId());

        // Validate user exists via RestTemplate
        try {
            String url = USER_SERVICE_URL + "/" + notification.getUserId();
            log.info("Validating user at: {}", url);
            restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            log.error("User validation failed: {}", e.getMessage());
            throw new RuntimeException("User not found with ID: " + notification.getUserId());
        }

        Notification savedNotification = notificationRepository.save(notification);
        log.info("Notification created successfully with ID: {}", savedNotification.getId());
        return savedNotification;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Notification> getNotificationById(Long id) {
        log.info("Fetching notification by ID: {}", id);
        return notificationRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserId(Long userId) {
        log.info("Fetching notifications for user ID: {}", userId);
        return notificationRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        log.info("Fetching unread notifications for user ID: {}", userId);
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }

    @Override
    public Notification markAsRead(Long id) {
        log.info("Marking notification as read: {}", id);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        log.info("Notification marked as read: {}", id);
        return updatedNotification;
    }

    @Override
    public void deleteNotification(Long id) {
        log.info("Deleting notification with ID: {}", id);

        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with ID: " + id);
        }

        notificationRepository.deleteById(id);
        log.info("Notification deleted successfully: {}", id);
    }
}
