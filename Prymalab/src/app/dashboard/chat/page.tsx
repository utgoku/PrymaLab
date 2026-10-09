'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

// Types
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  isOnline: boolean;
  lastMessage: string;
  lastActive: string;
  unreadCount: number;
}

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// Demo Data
const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Nguyễn Minh Tâm',
    role: 'Chuyên gia Dinh dưỡng',
    avatarColor: 'bg-teal-600',
    isOnline: true,
    lastMessage: 'Chế độ ăn tuần này của bạn rất tốt!',
    lastActive: '2 giờ trước',
    unreadCount: 0,
  },
  {
    id: '2',
    name: 'BS. Trần Thu Hà',
    role: 'Chuyên gia Giấc ngủ',
    avatarColor: 'bg-blue-600',
    isOnline: false,
    lastMessage: 'Hãy thử phương pháp 4-7-8 nhé',
    lastActive: '1 ngày trước',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'PrymaLab Support',
    role: 'Hỗ trợ khách hàng',
    avatarColor: 'bg-emerald-500',
    isOnline: true,
    lastMessage: 'Cảm ơn bạn đã liên hệ!',
    lastActive: '3 ngày trước',
    unreadCount: 1,
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Chào bạn! Tôi đã xem kết quả đánh giá sức khỏe của bạn. BMI hiện tại ở mức bình thường, rất tốt!', timestamp: '09:00' },
    { id: 'm2', senderId: 'me', text: 'Cảm ơn bác sĩ! Vậy em nên điều chỉnh chế độ ăn như thế nào ạ?', timestamp: '09:05' },
    { id: 'm3', senderId: '1', text: 'Với mục tiêu tăng cơ, bạn nên tăng lượng protein lên 1.6-2g/kg cân nặng. Tôi sẽ cập nhật thực đơn cho bạn.', timestamp: '09:10' },
    { id: 'm4', senderId: 'me', text: 'Dạ vâng, em sẽ theo dõi ạ 🙏', timestamp: '09:15' },
    { id: 'm5', senderId: '1', text: 'Chế độ ăn tuần này của bạn rất tốt! Hãy tiếp tục nhé 💪', timestamp: '10:30' },
  ],
  '2': [
    { id: 'm1', senderId: '2', text: 'Chào bạn, tình hình giấc ngủ của bạn dạo này thế nào?', timestamp: '08:00' },
    { id: 'm2', senderId: 'me', text: 'Em vẫn hơi khó ngủ vào ban đêm ạ.', timestamp: '08:15' },
    { id: 'm3', senderId: '2', text: 'Hãy thử phương pháp 4-7-8 nhé', timestamp: '08:30' },
  ],
  '3': [
    { id: 'm1', senderId: '3', text: 'Chào bạn, PrymaLab có thể giúp gì cho bạn?', timestamp: '14:00' },
    { id: 'm2', senderId: '3', text: 'Cảm ơn bạn đã liên hệ!', timestamp: '14:05' },
  ]
};

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = DEMO_CONVERSATIONS.find(c => c.id === activeConversationId);
  const currentMessages = useMemo(() => activeConversationId ? (messages[activeConversationId] || []) : [], [activeConversationId, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));
    
    setInputValue('');
  };

  const filteredConversations = DEMO_CONVERSATIONS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-100px)] max-h-[800px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      
      {/* Left Panel: Conversation List */}
      <div className={`w-full md:w-[350px] flex flex-col border-r border-gray-100 bg-gray-50/50 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <h1 className="text-xl font-serif font-bold text-gray-900 mb-4">Tin nhắn</h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-gray-50
                ${activeConversationId === conv.id ? 'bg-teal-50/50 border-l-4 border-teal-500' : 'border-l-4 border-transparent'}
              `}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full ${conv.avatarColor} text-white flex items-center justify-center text-lg font-bold shadow-sm`}>
                  {conv.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${conv.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conv.lastActive}</span>
                </div>
                <p className="text-xs text-teal-600 mb-1">{conv.role}</p>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                    {conv.lastMessage}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="bg-teal-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur-md z-10">
              <button 
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <BackIcon />
              </button>
              
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${activeConversation.avatarColor} text-white flex items-center justify-center font-bold`}>
                  {activeConversation.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${activeConversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              
              <div>
                <h2 className="font-bold text-gray-900">{activeConversation.name}</h2>
                <p className="text-xs text-gray-500">{activeConversation.role} • {activeConversation.isOnline ? 'Trực tuyến' : `Hoạt động ${activeConversation.lastActive}`}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F3F4F6]/30">
              {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                const showAvatar = !isMe && (index === currentMessages.length - 1 || currentMessages[index + 1]?.senderId === 'me');

                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    
                    {!isMe && (
                      <div className="w-8 flex-shrink-0 flex items-end">
                        {showAvatar && (
                          <div className={`w-8 h-8 rounded-full ${activeConversation.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                            {activeConversation.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`
                        px-4 py-2.5 shadow-sm text-[15px] leading-relaxed
                        ${isMe 
                          ? 'bg-teal-500 text-white rounded-2xl rounded-br-sm' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'}
                      `}>
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 mx-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all"
              >
                <button type="button" className="p-2 text-gray-400 hover:text-teal-600 rounded-full hover:bg-white transition-colors">
                  <PaperclipIcon />
                </button>
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                
                <button 
                  type="submit" 
                  disabled={!inputValue.trim()}
                  className="p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors shadow-sm"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 bg-[#F3F4F6]/20">
            <div className="w-24 h-24 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl border border-gray-100">
              👋
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-700 mb-2">Chào mừng đến với PrymaLab Chat</h3>
            <p className="text-center text-sm">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin với chuyên gia của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
