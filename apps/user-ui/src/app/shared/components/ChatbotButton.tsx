"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useChatbot } from '../../../context/ChatbotContext';

const ChatbotButton = () => {
  const { isOpen, setIsOpen } = useChatbot();
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Hide tooltip after 5 seconds or when user opens the chat
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  const handleClick = () => {
    setShowTooltip(false);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="absolute bottom-full right-0 mb-3 animate-in slide-in-from-bottom-2 duration-500">
          <div className="relative bg-white border-2 border-amber-600 text-gray-900 px-4 py-3 rounded-lg shadow-xl max-w-xs">
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-amber-600 transform rotate-45"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Chat with your LocalGoods Mitra! 🚀</p>
                <p className="text-xs text-gray-600 mt-0.5">Your friendly shopping companion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group relative"
        aria-label="Open LocalGoods Mitra"
      >
        <MessageCircle className="w-6 h-6" />
        {!isOpen && !showTooltip && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
        <span className="absolute inset-0 rounded-full bg-white opacity-20 group-hover:animate-ping" />
      </button>
    </div>
  );
};

export default ChatbotButton;

