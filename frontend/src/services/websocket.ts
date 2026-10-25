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

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    this.client = new Client({
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      webSocketFactory: () => {
        const wsUrl = typeof window !== 'undefined' && window.location.port === '5173'
          ? '/ws'
          : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') + '/ws' : 'http://localhost:8080/ws');
        return new SockJS(wsUrl);
      },
      debug: () => {},
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
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

  // Subscribe to user-specific private messages across both topic and queue endpoints
  subscribeToPrivateMessages(userId: string, callback: (message: MessageDTO) => void) {
    if (!this.client || !this.connected) return null;

    const seenIds = new Set<string>();
    const safeCallback = (msg: MessageDTO) => {
      if (msg && msg.id) {
        if (seenIds.has(msg.id)) return;
        seenIds.add(msg.id);
      }
      callback(msg);
    };

    const destTopic = `/topic/user.${userId}`;
    const destQueue = `/user/${userId}/queue/messages`;
    const destUserQueue = `/user/queue/messages`;

    const subTopic = this.client.subscribe(destTopic, (message: IMessage) => {
      try {
        const msg: MessageDTO = JSON.parse(message.body);
        safeCallback(msg);
      } catch (e) {
        console.error('Error parsing STOMP topic message', e);
      }
    });

    let subQueue: any = null;
    try {
      subQueue = this.client.subscribe(destQueue, (message: IMessage) => {
        try {
          const msg: MessageDTO = JSON.parse(message.body);
          safeCallback(msg);
        } catch (e) {}
      });
    } catch (e) {}

    let subUserQueue: any = null;
    try {
      subUserQueue = this.client.subscribe(destUserQueue, (message: IMessage) => {
        try {
          const msg: MessageDTO = JSON.parse(message.body);
          safeCallback(msg);
        } catch (e) {}
      });
    } catch (e) {}

    return {
      unsubscribe: () => {
        try { subTopic?.unsubscribe(); } catch (e) {}
        try { subQueue?.unsubscribe(); } catch (e) {}
        try { subUserQueue?.unsubscribe(); } catch (e) {}
      }
    };
  }

  // Subscribe to user-specific private typing indicators
  subscribeToPrivateTyping(userId: string, callback: (data: { senderId: string; isTyping: boolean }) => void) {
    if (!this.client || !this.connected) return null;

    const destTopic = `/topic/user.${userId}.typing`;
    const destQueue = `/user/${userId}/queue/typing`;

    const subTopic = this.client.subscribe(destTopic, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {}
    });

    let subQueue: any = null;
    try {
      subQueue = this.client.subscribe(destQueue, (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (e) {}
      });
    } catch (e) {}

    return {
      unsubscribe: () => {
        try { subTopic?.unsubscribe(); } catch (e) {}
        try { subQueue?.unsubscribe(); } catch (e) {}
      }
    };
  }

  // Subscribe to group chat channel
  subscribeToGroupMessages(groupId: string, callback: (message: MessageDTO) => void) {
    if (!this.client || !this.connected) return null;

    const destination = `/topic/group.${groupId}`;
    if (this.subscriptions[destination]) {
      return this.subscriptions[destination];
    }

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const msg: MessageDTO = JSON.parse(message.body);
        callback(msg);
      } catch (e) {}
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
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {}
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
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {}
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
