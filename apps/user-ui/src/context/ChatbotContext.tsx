"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  addMessage: (text: string, isBot: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! 👋 I'm your LocalGoods Mitra - your friendly shopping companion! I can help you find amazing products, answer questions, and guide you to the best deals. What would you like to explore today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        text: "Namaste! 👋 I'm your LocalGoods Mitra - your friendly shopping companion! I can help you find amazing products, answer questions, and guide you to the best deals. What would you like to explore today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        addMessage,
        isLoading,
        setIsLoading,
        clearMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

