package com.skillswap.service;

import com.skillswap.dto.MessageDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Group;
import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Autowired
    public ChatServiceImpl(MessageRepository messageRepository,
                           UserRepository userRepository,
                           GroupRepository groupRepository,
                           GroupMemberRepository groupMemberRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    @Transactional
    public MessageDTO savePrivateMessage(UUID senderId, UUID recipientId, String content, String mediaUrl) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .mediaUrl(mediaUrl)
                .read(false)
                .build();

        Message saved = messageRepository.save(message);

        // Gamification: Reward user with a tiny bit of XP (+1) for communicating
        sender.setXp(sender.getXp() + 1);
        userRepository.save(sender);

        return MessageDTO.fromMessage(saved);
    }

    @Override
    @Transactional
    public MessageDTO saveGroupMessage(UUID senderId, UUID groupId, String content, String mediaUrl) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        // Verify sender is in group
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, senderId)) {
            throw new BadRequestException("You are not a member of this learning group!");
        }

        Message message = Message.builder()
                .sender(sender)
                .group(group)
                .content(content)
                .mediaUrl(mediaUrl)
                .read(false)
                .build();

        Message saved = messageRepository.save(message);

        // Reward user XP (+1) for group collaboration
        sender.setXp(sender.getXp() + 1);
        userRepository.save(sender);

        return MessageDTO.fromMessage(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getPrivateChatHistory(UUID userA, UUID userB) {
        if (!userRepository.existsById(userA) || !userRepository.existsById(userB)) {
            throw new ResourceNotFoundException("User not found");
        }
        return messageRepository.findDirectMessages(userA, userB).stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getGroupChatHistory(UUID groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Group not found");
        }
        return messageRepository.findByGroupIdOrderByCreatedAtAsc(groupId).stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markMessagesAsRead(UUID recipientId, UUID senderId) {
        List<Message> unread = messageRepository.findUnreadMessagesForRecipient(recipientId).stream()
                .filter(m -> m.getSender().getId().equals(senderId))
                .collect(Collectors.toList());
        
        for (Message m : unread) {
            m.setRead(true);
        }
        messageRepository.saveAll(unread);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID recipientId, UUID senderId) {
        return messageRepository.countUnreadMessagesFromSender(recipientId, senderId);
    }
}
