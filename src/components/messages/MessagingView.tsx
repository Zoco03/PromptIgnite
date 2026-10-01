import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, Paperclip, CheckCheck, User, ShieldAlert, 
  Search, Image as ImageIcon, MoreVertical, Flag 
} from 'lucide-react';
import { Modal } from '../common/Modal';

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
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Find active conversation
  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const otherParticipant = activeConv ? activeConv.participantDetails.find(p => p.id !== currentUser.id) : null;

  const currentMessages = activeConv ? messages.filter(m => m.conversationId === activeConv.id) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachmentUrl) return;
    if (!otherParticipant) return;

    sendDirectMessage(otherParticipant.id, messageInput, attachmentUrl || undefined);
    setMessageInput('');
    setAttachmentUrl('');
  };

  const handleReportUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Report submitted for ${otherParticipant?.name}. Campus moderators will review within 12 hours.`);
    setIsReportModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-1">
            <span>PEER DIRECT COMMUNICATION (PRD 3.8)</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink uppercase tracking-tight">
            CAMPUS MESSAGES & COORDINATION
          </h1>
        </div>
        <div className="text-xs text-mute font-medium hidden sm:block">
          Spam-Protected: Direct messaging unlocked via session requests
        </div>
      </div>

      {/* Main Chat Interface: Left Thread List + Right Chat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-hairline min-h-[560px] bg-canvas">
        
        {/* LEFT: Conversation Threads (4 cols) */}
        <div className="lg:col-span-4 border-r border-hairline flex flex-col justify-between bg-soft-cloud/50">
          <div>
            <div className="p-3 border-b border-hairline bg-canvas">
              <input
                type="text"
                placeholder="Search conversations..."
                className="search-pill-input w-full text-xs"
              />
            </div>

            <div className="divide-y divide-hairline-soft overflow-y-auto max-h-[480px]">
              {conversations.map(conv => {
                const other = conv.participantDetails.find(p => p.id !== currentUser.id);
                const isActive = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                      isActive ? 'bg-canvas border-l-2 border-l-ink' : 'hover:bg-soft-cloud'
                    }`}
                  >
                    <img
                      src={other?.avatar}
                      alt={other?.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-semibold text-xs text-ink truncate">{other?.name}</h4>
                        <span className="text-[10px] text-mute whitespace-nowrap">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-mute truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Active Chat View (8 cols) */}
        {activeConv && otherParticipant ? (
          <div className="lg:col-span-8 flex flex-col justify-between min-h-[560px] bg-canvas">
            
            {/* Top Chat Partner Bar */}
            <div className="p-4 border-b border-hairline flex items-center justify-between bg-canvas">
              <div className="flex items-center gap-3">
                <img
                  src={otherParticipant.avatar}
                  alt={otherParticipant.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-xs text-ink">{otherParticipant.name}</h3>
                  <p className="text-[10px] text-mute">{otherParticipant.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="btn-icon-circular text-mute hover:text-sale"
                  title="Report / Block User"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[420px]">
              {currentMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3.5 text-xs leading-relaxed max-w-md ${
                      isMe 
                        ? 'bg-ink text-on-primary' 
                        : 'bg-soft-cloud text-ink border border-hairline'
                    }`}>
                      {msg.text}
                      {msg.attachmentUrl && (
                        <div className="mt-2 aspect-video overflow-hidden border border-canvas/20">
                          <img src={msg.attachmentUrl} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-mute mt-1">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-ink" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-hairline bg-soft-cloud flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message to coordinate session topics..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="search-pill-input flex-1 text-xs"
              />

              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <span>SEND</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center text-mute text-xs">
            Select a conversation to start chatting.
          </div>
        )}
      </div>

      {/* REPORT USER MODAL */}
      {isReportModalOpen && otherParticipant && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={`REPORT USER: ${otherParticipant.name.toUpperCase()}`}
          subtitle="All reports are audited by Campus Faculty Disciplinary Council"
          maxWidth="md"
        >
          <form onSubmit={handleReportUser} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Violation Category
              </label>
              <select
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                <option value="">Select violation...</option>
                <option value="Spam / Unsolicited Ads">Spam / Unsolicited Ads</option>
                <option value="Academic Dishonesty">Academic Dishonesty / Exam Cheating</option>
                <option value="Inappropriate Language">Inappropriate Language / Harassment</option>
                <option value="Token Collusion">Attempting Off-Platform Fiat Payment</option>
              </select>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary !bg-sale !text-on-primary text-xs"
              >
                SUBMIT REPORT
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
