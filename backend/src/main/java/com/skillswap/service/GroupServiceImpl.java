package com.skillswap.service;

import com.skillswap.dto.CreateGroupRequest;
import com.skillswap.dto.GroupDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Group;
import com.skillswap.model.GroupMember;
import com.skillswap.model.User;
import com.skillswap.repository.GroupMemberRepository;
import com.skillswap.repository.GroupRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository,
                            GroupMemberRepository groupMemberRepository,
                            UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public GroupDTO createGroup(UUID creatorId, CreateGroupRequest request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));

        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .creator(creator)
                .isPrivate(request.isPrivate())
                .build();

        Group savedGroup = groupRepository.save(group);

        // Add creator as ADMIN member
        GroupMember adminMember = GroupMember.builder()
                .group(savedGroup)
                .user(creator)
                .role("ADMIN")
                .build();
        groupMemberRepository.save(adminMember);

        return GroupDTO.fromGroup(savedGroup, 1);
    }

    @Override
    @Transactional
    public void joinGroup(UUID userId, UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new BadRequestException("You are already a member of this group!");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .role("MEMBER")
                .build();
        groupMemberRepository.save(member);

        // Gamification: Reward XP for joining a learning group
        user.setXp(user.getXp() + 5);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void leaveGroup(UUID userId, UUID groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Group not found");
        }
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new BadRequestException("You are not a member of this group!");
        }
        
        // Find member and delete
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getGroupMembers(UUID groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Group not found");
        }
        return groupMemberRepository.findByGroupId(groupId).stream()
                .map(m -> UserDTO.fromUser(m.getUser()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupDTO getGroupDetails(UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        long memberCount = groupMemberRepository.findByGroupId(groupId).size();
        return GroupDTO.fromGroup(group, memberCount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAllPublicGroups().stream()
                .map(g -> {
                    long count = groupMemberRepository.findByGroupId(g.getId()).size();
                    return GroupDTO.fromGroup(g, count);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupDTO> getUserGroups(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        List<GroupMember> memberships = groupMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(m -> {
                    Group g = m.getGroup();
                    long count = groupMemberRepository.findByGroupId(g.getId()).size();
                    return GroupDTO.fromGroup(g, count);
                })
                .collect(Collectors.toList());
    }
}
