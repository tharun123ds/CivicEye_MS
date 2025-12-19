package com.civiceye.user.service;

import com.civiceye.user.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * User Service Interface
 * Business logic for user operations
 */
public interface UserService {

    /**
     * Register a new user
     */
    User registerUser(User user);

    /**
     * Authenticate user (login)
     */
    User authenticateUser(String email, String password);

    /**
     * Get user by ID
     */
    Optional<User> getUserById(Long id);

    /**
     * Get all users
     */
    List<User> getAllUsers();

    /**
     * Update user
     */
    User updateUser(Long id, User user);

    /**
     * Delete user
     */
    void deleteUser(Long id);

    /**
     * Get user by email
     */
    Optional<User> getUserByEmail(String email);

    /**
     * Get user by username
     */
    Optional<User> getUserByUsername(String username);
}
