package com.skillswap.controller;

import com.skillswap.dto.CreateGroupRequest;
import com.skillswap.dto.GroupDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody CreateGroupRequest request) {
        GroupDTO response = groupService.createGroup(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllPublicGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupDTO>> getMyGroups(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.getUserGroups(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupDetails(id));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinGroup(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable UUID id) {
        groupService.joinGroup(principal.getId(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveGroup(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable UUID id) {
        groupService.leaveGroup(principal.getId(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<UserDTO>> getMembers(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupMembers(id));
    }
}
