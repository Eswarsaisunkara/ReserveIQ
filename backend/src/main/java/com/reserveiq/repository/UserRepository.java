package com.reserveiq.repository;

import com.reserveiq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by their unique email address.
     * 
     * @param email user's email
     * @return Optional of User
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists with the given email.
     * 
     * @param email user's email
     * @return true if exists
     */
    boolean existsByEmail(String email);
}
