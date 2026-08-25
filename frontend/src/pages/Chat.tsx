import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { UserDTO, GroupDTO, MessageDTO } from '../services/types';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Circle, 
  Sparkles, 
  Clock, 
  FileImage 
} from 'lucide-react';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Left Panel list
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [peers, setPeers] = useState<UserDTO[]>([]);
  const [groups, setGroups] = useState<GroupDTO[]>([]);
  
  // Selected Chat
  const [selectedPeer, setSelectedPeer] = useState<UserDTO | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupDTO | null>(null);
  
  // Messages and Feed
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [messageText, setMessageText] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  
  // Live Status / Indicators
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>({});
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  const [typingText, setTypingText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const isTypingStateRef = useRef(false);

  // Auto-scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // Initial data loading
  useEffect(() => {
    const initData = async () => {
      try {
        const [connections, myGroups] = await Promise.all([
          api.connections.getMy(),
          api.groups.getMy(),
        ]);
        setPeers(connections);
        setGroups(myGroups);

        // Fetch unread count for each peer
        const unreads: { [key: string]: number } = {};
        for (const peer of connections) {
          try {
            const count = await api.chat.getUnreadCount(peer.id);
            unreads[peer.id] = count;
          } catch (err) {
            console.error('Error fetching unread count', err);
          }
        }
        setUnreadCounts(unreads);

        // Check query parameters to select direct chat
        const params = new URLSearchParams(location.search);
        const userIdParam = params.get('userId');
        const groupIdParam = params.get('groupId');
        if (userIdParam) {
          const peer = connections.find(c => c.id === userIdParam);
          if (peer) {
            setChatType('direct');
            handleSelectPeer(peer);
          } else {
            // Fetch profile dynamically if not in connections
            const profile = await api.users.getProfile(userIdParam);
            setPeers(prev => [...prev, profile]);
            setChatType('direct');
            handleSelectPeer(profile);
          }
        } else if (groupIdParam) {
          const grp = myGroups.find(g => g.id === groupIdParam);
          if (grp) {
            setChatType('group');
            handleSelectGroup(grp);
          }
        }
      } catch (err) {
        console.error('Error initializing chat data', err);
      }
    };

    if (user) {
      initData();
    }
  }, [user, location.search]);

  // WebSocket Direct & Group Message subscriptions
  useEffect(() => {
    if (!user) return;

    // Connect WebSocket if not connected
    wsService.connect();

    // 1. Subscribe to direct private messages
    const privateMsgSub = wsService.subscribeToPrivateMessages(user.id, (newMsg) => {
      // Check if message belongs to currently selected peer chat
      if (selectedPeer && (newMsg.sender.id === selectedPeer.id || newMsg.recipient?.id === selectedPeer.id)) {
        setMessages(prev => [...prev, newMsg]);
        // Mark as read immediately on server if open
        if (newMsg.sender.id === selectedPeer.id) {
          api.chat.markAsRead(selectedPeer.id);
        }
      } else {
        // Increment unread count in sidebar
        const senderId = newMsg.sender.id;
        setUnreadCounts(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
      }
    });

    // 2. Subscribe to typing indicators
    const typingSub = wsService.subscribeToPrivateTyping(user.id, (data) => {
      if (selectedPeer && data.senderId === selectedPeer.id) {
        setTypingUsers(prev => ({
          ...prev,
          [data.senderId]: data.isTyping
        }));
        setTypingText(data.isTyping ? `${selectedPeer.fullName} is typing...` : '');
      }
    });

    // 3. Subscribe to user online status updates
    const statusSub = wsService.subscribeToUserStatus((data) => {
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: data.online
      }));
    });

    return () => {
      if (privateMsgSub) privateMsgSub.unsubscribe();
      if (typingSub) typingSub.unsubscribe();
      if (statusSub) statusSub.unsubscribe();
    };
  }, [user, selectedPeer]);

  // WebSocket Group Message subscription
  useEffect(() => {
    if (!selectedGroup || !user) return;

    // Subscribe to group topic
    const groupSub = wsService.subscribeToGroupMessages(selectedGroup.id, (newMsg) => {
      // Don't duplicate sender's own broadcast if client already pushed it (but wait, STOMP broadcasts to all so we overwrite)
      setMessages(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    // Subscribe to group typing indicator
    const groupTypingSub = wsService.subscribeToGroupTyping(selectedGroup.id, (data) => {
      if (data.senderId !== user.id) {
        setTypingUsers(prev => ({
          ...prev,
          [data.senderId]: data.isTyping
        }));
        setTypingText(data.isTyping ? `${data.senderName} is typing...` : '');
      }
    });

    return () => {
      if (groupSub) groupSub.unsubscribe();
      if (groupTypingSub) groupTypingSub.unsubscribe();
    };
  }, [selectedGroup, user]);

  const handleSelectPeer = async (peer: UserDTO) => {
    setSelectedPeer(peer);
    setSelectedGroup(null);
    setMessages([]);
    setTypingText('');
    
    // Clear unreads
    setUnreadCounts(prev => ({ ...prev, [peer.id]: 0 }));
    
    try {
      const history = await api.chat.getDirectHistory(peer.id);
      setMessages(history);
      await api.chat.markAsRead(peer.id);
    } catch (err) {
      console.error('Error fetching direct history', err);
    }
  };

  const handleSelectGroup = async (grp: GroupDTO) => {
    setSelectedGroup(grp);
    setSelectedPeer(null);
    setMessages([]);
    setTypingText('');
    
    try {
      const history = await api.chat.getGroupHistory(grp.id);
      setMessages(history);
    } catch (err) {
      console.error('Error fetching group history', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (!user) return;

    const recipientId = selectedPeer ? selectedPeer.id : null;
    const groupId = selectedGroup ? selectedGroup.id : null;

    if (!isTypingStateRef.current) {
      isTypingStateRef.current = true;
      wsService.sendTypingStatus(user.id, user.fullName, recipientId, groupId, true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingStateRef.current = false;
      wsService.sendTypingStatus(user.id, user.fullName, recipientId, groupId, false);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    if (selectedPeer) {
      wsService.sendPrivateMessage(user.id, selectedPeer.id, messageText.trim());
    } else if (selectedGroup) {
      wsService.sendGroupMessage(user.id, selectedGroup.id, messageText.trim());
    }

    // Stop typing immediately on send
    const recipientId = selectedPeer ? selectedPeer.id : null;
    const groupId = selectedGroup ? selectedGroup.id : null;
    clearTimeout(typingTimeoutRef.current);
    isTypingStateRef.current = false;
    wsService.sendTypingStatus(user.id, user.fullName, recipientId, groupId, false);

    setMessageText('');
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-[#1f2833]/20 border border-[#45f3ff]/10 rounded-2xl flex overflow-hidden shadow-2xl">
      
      {/* Sidebar Threads */}
      <aside className="w-80 bg-[#1f2833]/40 border-r border-[#45f3ff]/10 flex flex-col">
        {/* Toggle between Peer Chat and Group Chat */}
        <div className="flex border-b border-[#45f3ff]/10 shrink-0">
          <button
            onClick={() => setChatType('direct')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              chatType === 'direct'
                ? 'text-[#45f3ff] border-[#45f3ff] bg-[#0b0c10]/20'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Peers</span>
          </button>
          <button
            onClick={() => setChatType('group')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              chatType === 'group'
                ? 'text-[#45f3ff] border-[#45f3ff] bg-[#0b0c10]/20'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </button>
        </div>

        {/* Chat List Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {chatType === 'direct' ? (
            peers.length === 0 ? (
              <div className="text-center text-gray-500 text-xs py-8">No connections found. Connect with peers first!</div>
            ) : (
              peers.map((peer) => {
                const isSelected = selectedPeer?.id === peer.id;
                const isOnline = onlineUsers[peer.id];
                const unread = unreadCounts[peer.id] || 0;
                return (
                  <button
                    key={peer.id}
                    onClick={() => handleSelectPeer(peer)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/30 text-white' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-[#0b0c10] border border-gray-800 flex items-center justify-center font-bold text-white text-base">
                        {peer.fullName.charAt(0)}
                      </div>
                      <Circle className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full fill-current ${isOnline ? 'text-emerald-500' : 'text-gray-600'}`} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="font-semibold truncate text-sm text-white flex items-center justify-between">
                        <span>{peer.fullName}</span>
                        {unread > 0 && (
                          <span className="bg-[#45f3ff] text-black text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                            {unread}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">{peer.college}</div>
                    </div>
                  </button>
                );
              })
            )
          ) : (
            groups.length === 0 ? (
              <div className="text-center text-gray-500 text-xs py-8 font-medium">You haven't joined any groups yet.</div>
            ) : (
              groups.map((grp) => {
                const isSelected = selectedGroup?.id === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => handleSelectGroup(grp)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/30 text-white' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-[#0b0c10] border border-gray-800 flex items-center justify-center font-bold text-[#45f3ff] text-base shrink-0">
                      #
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="font-semibold truncate text-sm text-white">{grp.name}</div>
                      <div className="text-[10px] text-gray-500 truncate mt-0.5">{grp.description || 'Study Room'}</div>
                    </div>
                  </button>
                );
              })
            )
          )}
        </div>
      </aside>

      {/* Right Feed Chat */}
      <main className="flex-1 flex flex-col bg-[#0b0c10]/40">
        {selectedPeer || selectedGroup ? (
          <>
            {/* Thread Header */}
            <div className="h-16 border-b border-[#45f3ff]/10 flex items-center justify-between px-6 bg-[#1f2833]/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#45f3ff]/20 to-[#6f42c1]/20 border border-[#45f3ff]/20 flex items-center justify-center font-bold text-white text-base">
                  {selectedPeer ? selectedPeer.fullName.charAt(0) : '#'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {selectedPeer ? selectedPeer.fullName : selectedGroup?.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    {selectedPeer ? (
                      <>
                        <Circle className={`h-2 w-2 fill-current ${onlineUsers[selectedPeer.id] ? 'text-emerald-500' : 'text-gray-600'}`} />
                        <span>{onlineUsers[selectedPeer.id] ? 'Online' : 'Offline'}</span>
                      </>
                    ) : (
                      <span>Group Chat Room</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                  <MessageSquare className="h-10 w-10 text-gray-800 mb-2" />
                  <p className="text-xs">No message history.</p>
                  <p className="text-[10px] text-gray-700">Type a message below to start swapping knowledge!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender.id === user?.id;
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 max-w-[80%] ${isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Peer avatar in group chat */}
                      {!isOwnMessage && selectedGroup && (
                        <div className="h-8 w-8 rounded-lg bg-[#1f2833] flex items-center justify-center font-bold text-white text-xs shrink-0 mt-1 border border-gray-800">
                          {msg.sender.fullName.charAt(0)}
                        </div>
                      )}

                      <div>
                        {/* Sender name for group chat */}
                        {!isOwnMessage && selectedGroup && (
                          <div className="text-[10px] text-gray-500 mb-1 ml-1 font-semibold">{msg.sender.fullName}</div>
                        )}

                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                          isOwnMessage 
                            ? 'bg-gradient-to-tr from-[#6f42c1] to-[#45f3ff] text-white rounded-tr-none shadow-glow'
                            : 'bg-[#1f2833] text-gray-100 rounded-tl-none border border-gray-800'
                        }`}>
                          <p>{msg.content}</p>
                          <div className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                            <Clock className="h-3 w-3" />
                            <span>{formatMessageTime(msg.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing Indicator */}
              {typingText && (
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-2 animate-pulse">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" />
                  <span>{typingText}</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#45f3ff]/10 bg-[#1f2833]/15 flex gap-3 shrink-0">
              <input
                type="text"
                required
                placeholder="Type your message here..."
                value={messageText}
                onChange={handleInputChange}
                className="flex-1 bg-[#0b0c10]/60 border border-gray-700 focus:border-[#45f3ff] text-white rounded-xl py-3 px-4 outline-none text-sm"
              />
              <button
                type="submit"
                className="h-12 w-12 bg-gradient-to-tr from-[#45f3ff] to-[#6f42c1] hover:brightness-110 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all shadow-glow shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 bg-[#1f2833] rounded-2xl flex items-center justify-center mb-4 border border-[#45f3ff]/10">
              <MessageSquare className="h-8 w-8 text-[#45f3ff]" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">Your Conversations</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Select a peer connection or learning group chat from the sidebar, or connect with matches to start swap chats!
            </p>
          </div>
        )}
      </main>

    </div>
  );
};
