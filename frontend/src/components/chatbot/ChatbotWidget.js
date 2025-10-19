import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, startConversation, toggleChatbot } from '../../store/slices/chatbotSlice';
import { isAuthenticated } from '../../store/slices/authSlice';

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, isLoading, isSendingMessage } = useSelector((state) => state.chatbot);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage) return;

    const message = inputMessage.trim();
    setInputMessage('');

    try {
      if (messages.length === 0) {
        // Start new conversation
        await dispatch(startConversation()).unwrap();
      }
      
      // Add user message to store
      dispatch({
        type: 'chatbot/addMessage',
        payload: {
          type: 'user',
          message: message,
          metadata: { timestamp: new Date().toISOString() }
        }
      });

      // Send message to chatbot
      await dispatch(sendMessage({
        message: message,
        sessionId: null // Will be handled by the slice
      })).unwrap();

    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleToggle = () => {
    dispatch(toggleChatbot());
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen 
            ? 'bg-warm-rust hover:bg-warm-terracotta' 
            : 'bg-warm-terracotta hover:bg-warm-rust hover:scale-110'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chatbot Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-earth-200 z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-warm-terracotta to-warm-rust p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">VHA Style Assistant</h3>
                  <p className="text-sm opacity-90">Trợ lý thời trang AI</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-warm-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warm-terracotta" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-earth-900 mb-2">Xin chào! Tôi là VHA Style Assistant</h4>
                <p className="text-sm text-earth-600 mb-4">
                  Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn phong cách và trả lời các câu hỏi về thời trang.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setInputMessage('Tôi muốn tìm áo sơ mi nam')}
                    className="block w-full text-left px-3 py-2 bg-earth-50 hover:bg-earth-100 rounded-lg text-sm text-earth-700 transition-colors duration-300"
                  >
                    Tìm áo sơ mi nam
                  </button>
                  <button
                    onClick={() => setInputMessage('Tư vấn phong cách cho công sở')}
                    className="block w-full text-left px-3 py-2 bg-earth-50 hover:bg-earth-100 rounded-lg text-sm text-earth-700 transition-colors duration-300"
                  >
                    Tư vấn phong cách công sở
                  </button>
                  <button
                    onClick={() => setInputMessage('Cách mix đồ với màu be')}
                    className="block w-full text-left px-3 py-2 bg-earth-50 hover:bg-earth-100 rounded-lg text-sm text-earth-700 transition-colors duration-300"
                  >
                    Cách mix đồ với màu be
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-warm-terracotta text-white'
                        : 'bg-earth-100 text-earth-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-white/70' : 'text-earth-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="bg-earth-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-earth-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-earth-300 rounded-xl focus:ring-2 focus:ring-warm-terracotta focus:border-transparent transition-all duration-300"
                disabled={isSendingMessage}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSendingMessage}
                className="px-4 py-2 bg-warm-terracotta text-white rounded-xl hover:bg-warm-rust disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
