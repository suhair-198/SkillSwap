import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageDTO } from './types';

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private connectionCallbacks: Set<(connected: boolean) => void> = new Set();
  private subscriptions: { [key: string]: any } = {};

  connect(onConnectChange?: (connected: boolean) => void) {
    if (onConnectChange) {
      this.connectionCallbacks.add(onConnectChange);
      // Immediately call with current state
      onConnectChange(this.connected);
    }

    if (this.client) {
      return; // Already initialized
    }

    // Since we are using SockJS, we pass it via webSocketFactory
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        // Uncomment for debug logs
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      this.connectionCallbacks.forEach(cb => cb(true));
      console.log('Connected to STOMP Broker');
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      this.connectionCallbacks.forEach(cb => cb(false));
      console.log('Disconnected from STOMP Broker');
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.connectionCallbacks.forEach(cb => cb(false));
      this.connectionCallbacks.clear();
      this.subscriptions = {};
    }
  }

  isWebSocketConnected() {
    return this.connected;
  }

  // Subscribe to user-specific private messages
  subscribeToPrivateMessages(userId: string, callback: (message: MessageDTO) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/user/${userId}/queue/messages`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      const msg: MessageDTO = JSON.parse(message.body);
      callback(msg);
    });

    this.subscriptions[destination] = sub;
    return sub;
  }

  // Subscribe to user-specific private typing indicators
  subscribeToPrivateTyping(userId: string, callback: (data: { senderId: string; isTyping: boolean }) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/user/${userId}/queue/typing`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions[destination] = sub;
    return sub;
  }

  // Subscribe to group chat channel
  subscribeToGroupMessages(groupId: string, callback: (message: MessageDTO) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/topic/group.${groupId}`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      const msg: MessageDTO = JSON.parse(message.body);
      callback(msg);
    });

    this.subscriptions[destination] = sub;
    return sub;
  }

  // Subscribe to group typing indicators
  subscribeToGroupTyping(groupId: string, callback: (data: { senderId: string; senderName: string; isTyping: boolean }) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/topic/group.${groupId}.typing`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions[destination] = sub;
    return sub;
  }

  // Subscribe to overall user online statuses
  subscribeToUserStatus(callback: (data: { userId: string; online: boolean }) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/topic/status`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions[destination] = sub;
    return sub;
  }

  // Unsubscribe helper
  unsubscribe(destination: string) {
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe();
      delete this.subscriptions[destination];
    }
  }

  // Publish: Send Private Message
  sendPrivateMessage(senderId: string, recipientId: string, content: string, mediaUrl?: string) {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.sendPrivate',
      body: JSON.stringify({
        senderId,
        recipientId,
        content,
        mediaUrl
      }),
    });
  }

  // Publish: Send Group Message
  sendGroupMessage(senderId: string, groupId: string, content: string, mediaUrl?: string) {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.sendGroup',
      body: JSON.stringify({
        senderId,
        groupId,
        content,
        mediaUrl
      }),
    });
  }

  // Publish: Send Typing status
  sendTypingStatus(senderId: string, senderName: string, recipientId: string | null, groupId: string | null, isTyping: boolean) {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        senderId,
        senderName,
        recipientId,
        groupId,
        isTyping
      }),
    });
  }

  // Publish: Status Update (Online/Offline)
  sendStatusUpdate(userId: string, online: boolean) {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: '/app/chat.status',
      body: JSON.stringify({
        userId,
        online
      }),
    });
  }
}

export const wsService = new WebSocketService();
