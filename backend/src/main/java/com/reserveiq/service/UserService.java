package com.reserveiq.service;

import com.reserveiq.dto.StatsDTO;
import com.reserveiq.dto.UserDTO;
import com.reserveiq.entity.Role;

import java.util.List;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO updateUserRole(Long userId, Role newRole);

    void deleteUser(Long userId);

    StatsDTO getPlatformStats();
}
