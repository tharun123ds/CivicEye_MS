package com.civiceye.notification.service;

import com.civiceye.notification.entity.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Notification createNotification(Notification notification);
    Optional<Notification> getNotificationById(Long id);
    List<Notification> getNotificationsByUserId(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    Notification markAsRead(Long id);
    void deleteNotification(Long id);
}
