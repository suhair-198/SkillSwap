package com.skillswap.service;

import com.skillswap.dto.CreateGroupRequest;
import com.skillswap.dto.GroupDTO;
import com.skillswap.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface GroupService {
    GroupDTO createGroup(UUID creatorId, CreateGroupRequest request);
    void joinGroup(UUID userId, UUID groupId);
    void leaveGroup(UUID userId, UUID groupId);
    List<UserDTO> getGroupMembers(UUID groupId);
    GroupDTO getGroupDetails(UUID groupId);
    List<GroupDTO> getAllGroups();
    List<GroupDTO> getUserGroups(UUID userId);
}
