import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, User, Search, 
  MessageSquare, UserPlus, CheckCircle2
} from 'lucide-react';

export const MessagingView: React.FC = () => {
  const { 
    currentUser, 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    messages, 
    sendDirectMessage,
    allUsers 
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedNewPeerId, setSelectedNewPeerId] = useState<string | null>(null);

  // Filter peers excluding myself
  const availablePeers = allUsers.filter(u => u.id !== currentUser?.id);

  // Active Conversation resolution
  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const otherParticipant = activeConv 
    ? activeConv.participantDetails.find(p => p.id !== currentUser?.id)
    : (selectedNewPeerId ? allUsers.find(u => u.id === selectedNewPeerId) : availablePeers[0]);

  const currentMessages = activeConv ? messages.filter(m => m.conversationId === activeConv.id) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !otherParticipant || !currentUser) return;

    sendDirectMessage(otherParticipant.id, messageInput);
    setMessageInput('');
  };

  const handleStartNewChat = (peerId: string) => {
    setSelectedNewPeerId(peerId);
    // Find if conversation already exists
    const existing = conversations.find(c => 
      c.participantIds.includes(currentUser?.id || '') && c.participantIds.includes(peerId)
    );
    if (existing) {
      setActiveConversationId(existing.id);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="border-b border-[#111111] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#707072] mb-1">
            DIRECT STUDENT CHAT & MENTORSHIP COORDINATION
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-[#111111] leading-none">
            CAMPUS MESSAGES
          </h1>
        </div>
        <div className="text-xs font-mono text-[#707072]">
          ● Real-Time Multi-Account Sync Active
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#111111] bg-white min-h-[580px]">

        {/* ── LEFT: CONVERSATIONS & PEERS LIST (4 cols) ── */}
        <div className="lg:col-span-4 border-r-2 border-[#111111] flex flex-col bg-[#f5f5f5]">

          {/* Search bar */}
          <div className="p-3 border-b border-[#e5e5e5] bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#707072] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search peers or chats..."
                className="w-full bg-[#f5f5f5] text-xs pl-8 pr-3 py-2 rounded-full border border-[#e5e5e5] outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e5e5e5]">
            <div className="p-2.5 text-[10px] font-mono uppercase tracking-wider text-[#707072] bg-[#e5e5e5]/50">
              Active Conversations ({conversations.length})
            </div>

            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#707072]">
                No active conversations yet. Select a peer below to start chatting!
              </div>
            ) : (
              conversations.map(conv => {
                const other = conv.participantDetails.find(p => p.id !== currentUser?.id);
                const isActive = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center gap-3 ${
                      isActive ? 'bg-white border-l-4 border-l-[#111111]' : 'hover:bg-white/60'
                    }`}
                  >
                    <img
                      src={other?.avatar}
                      alt={other?.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#111111] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#111111] truncate">{other?.name}</span>
                        <span className="text-[10px] font-mono text-[#707072]">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#707072] truncate mt-0.5">{conv.lastMessage}</div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Peers Directory to Start New Chat */}
            {availablePeers.length > 0 && (
              <>
                <div className="p-2.5 text-[10px] font-mono uppercase tracking-wider text-[#707072] bg-[#e5e5e5]/50 flex items-center justify-between">
                  <span>Registered Peers ({availablePeers.length})</span>
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                {availablePeers.map(peer => (
                  <div
                    key={peer.id}
                    onClick={() => handleStartNewChat(peer.id)}
                    className="p-3 cursor-pointer hover:bg-white transition-colors flex items-center gap-2.5"
                  >
                    <img src={peer.avatar} alt={peer.name} className="w-8 h-8 rounded-full object-cover border border-[#111111]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-[#111111] truncate">{peer.name}</div>
                      <div className="text-[10px] text-[#707072] truncate">{peer.department.split('&')[0]}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#007d48]">Chat →</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: ACTIVE CHAT FEED (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col justify-between h-[580px] bg-white">

          {otherParticipant ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-[#e5e5e5] flex items-center justify-between bg-[#f5f5f5]">
                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#111111]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#111111]">{otherParticipant.name}</h3>
                    <div className="text-[11px] text-[#707072]">{otherParticipant.department}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sendDirectMessage(otherParticipant.id, 'Hey! Are you open for a quick skill swap?')}
                    className="btn-secondary !py-1 !px-3 text-[11px]"
                  >
                    Send Quick Greeting 👋
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                {currentMessages.length === 0 ? (
                  <div className="p-12 text-center text-xs text-[#707072] space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#9e9ea0] mx-auto" />
                    <p>No messages yet with {otherParticipant.name}. Say hello to start swapping!</p>
                  </div>
                ) : (
                  currentMessages.map(msg => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#111111] text-white rounded-2xl rounded-tr-none'
                              : 'bg-[#f5f5f5] text-[#111111] border border-[#e5e5e5] rounded-2xl rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-mono text-[#9e9ea0] mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e5e5e5] flex items-center gap-2 bg-[#f5f5f5]">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder={`Message ${otherParticipant.name}...`}
                  className="flex-1 bg-white text-xs px-4 py-2.5 rounded-full border border-[#cacacb] focus:border-[#111111] outline-none"
                />
                <button
                  type="submit"
                  className="btn-primary !p-2.5 rounded-full flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-[#707072] space-y-2">
              <MessageSquare className="w-10 h-10 text-[#cacacb]" />
              <p className="font-bold text-sm text-[#111111]">No Peer Selected</p>
              <p>Choose an existing conversation or a registered peer from the left panel to message them.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
