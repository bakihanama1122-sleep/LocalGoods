"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useRequiredAuth from "apps/user-ui/src/hooks/useRequiredAuth";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { isProtected } from "apps/user-ui/src/utils/protected";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "../../shared/components/chats/chatinput";
import { useWebSocket } from "apps/user-ui/src/context/web-socket-context";

const page = () => {
  const searchParams = useSearchParams();
  const { user } = useRequiredAuth();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const conversationId = searchParams.get("conversationId");
  const { ws, wsReady, lastMessage } = useWebSocket();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/chatting/api/get-user-conversations",
        isProtected
      );
      return res.data.conversations;
    },
  });

  useEffect(() => {
    if (conversations) setChats(conversations);
  }, [conversations]);

  useEffect(() => {
    if (conversationId && chats.length > 0) {
      const chat = chats.find((c) => c.conversationId === conversationId);
      setSelectedChat(chat || null);
    }
  }, [conversationId, chats]);

  const getLastMessage = (chat: any) => chat?.lastMessage || "";

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId || hasFetchedOnce) return [];
      const res = await axiosInstance.get(
        `chatting/api/get-messages/${conversationId}?page=1`,
        isProtected
      );
      setPage(1);
      setHasMore(res.data.hasMore);
      setHasFetchedOnce(true);
      return res.data.messages.reverse();
    },
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (messages?.length > 0) scrollToBottom();
  }, [messages]);

  const loadMoreMessages = async () => {
    const nextPage = page + 1;
    const res = await axiosInstance.get(
      `/chatting/api/get-messages/${conversationId}?page=${nextPage}`,
      isProtected
    );

    queryClient.setQueryData(["messages", conversationId], (old: any = []) => [
      ...res.data.messages.reverse(),
      ...old,
    ]);

    setPage(nextPage);
    setHasMore(res.data.hasMore);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    });
  };

  const handleSend = async (e: any) => {

    console.log("CAME - 1")
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    console.log("CAME - 2")

    if (!wsReady || !ws) {
    console.error("WebSocket not ready or not available.");
    return;
  }
    console.log("CAME - 3")
    const payload = {
      type: "NEW_MESSAGE",
      fromUserId: user?.id,
      toUserId: selectedChat?.seller?.id,
      conversationId: selectedChat?.conversationId,
      messageBody: message,
      senderType: "user",
    };

    const tempMessageId = `temp_${Date.now()}_${Math.random()}`;
    queryClient.setQueryData(["messages", selectedChat.conversationId], (old: any = []) => [
    ...old,
    {
      id: tempMessageId,
      content: message,
      senderType: "user",
      seen: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  console.log("CAME - 4")
    ws?.send(JSON.stringify(payload));
    console.log("CAME - 5")

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.conversationId
          ? { ...chat, lastMessage: payload.messageBody }
          : chat
      )
    );
    setMessage("");
    scrollToBottom();
    console.log("CAME - 6")
  };

  const handleChatSelect = (chat: any) => {
    setHasFetchedOnce(false);
    setChats((prev) =>
      prev.map((c) =>
        c.conversationId === chat.conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
    router.push(`?conversationId=${chat.conversationId}`);

    ws?.send(
      JSON.stringify({
        type: "MARK_AS_SEEN",
        conversationId: chat.conversationId,
      })
    );
  };

  // useEffect(() => {
  //   if (!ws) return;

  //   ws.onmessage = (event: any) => {
  //     const data = JSON.parse(event.data);

  //     if (data.type === "NEW_MESSAGE") {
  //       const newMsg = data?.payload;

  //       if (newMsg.conversationId === conversationId) {
  //         queryClient.setQueryData(
  //           ["messages", conversationId],
  //           (old: any = []) => [
  //             ...old,
  //             {
  //               content: newMsg.mesageBody || newMsg.content || "",
  //               senderType: newMsg.senderType,
  //               seen: false,
  //               createdAt: newMsg.createdAt || new Date().toISOString(),
  //             },
  //           ]
  //         );
  //         scrollToBottom();
  //       }

  //       setChats((prevChats) =>
  //         prevChats.map((chat) =>
  //           chat.conversationId === newMsg.conversationId
  //             ? { ...chat, lastMessage: newMsg.content }
  //             : chat
  //         )
  //       );
  //     }

  //     if (data.type === "UNSEEN_COUNT_UPDATE") {
  //       const { conversationId, count } = data.payload;
  //       setChats((prevChats) =>
  //         prevChats.map((chat) =>
  //           chat.conversationId === conversationId
  //             ? { ...chat, unreadCount: count }
  //             : chat
  //         )
  //       );
  //     }
  //   };
  // }, [ws, conversationId]);

  useEffect(() => {
    // This effect runs only when a new message arrives from the context
    if (!lastMessage) return;

    // Skip if this is a message from the current user (to prevent duplicates)
    // Check both fromUserId and senderId to handle different message formats
    if (lastMessage.fromUserId === user?.id || lastMessage.senderId === user?.id) return;

    // Update the message list if the new message belongs to the open chat
    if (lastMessage.conversationId === conversationId) {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: any[] = []) => {
          // Check if message already exists to prevent duplicates
          const messageExists = old.some(msg => 
            msg.id === lastMessage.id || 
            (msg.content === lastMessage.content && 
             msg.createdAt === lastMessage.createdAt &&
             msg.senderType === lastMessage.senderType)
          );
          
          if (messageExists) {
            return old;
          }
          
          return [...old, lastMessage];
        }
      );
      scrollToBottom();
    }

    // Always update the chat list preview on the side
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.conversationId === lastMessage.conversationId
          ? { ...chat, lastMessage: lastMessage.content || lastMessage.messageBody }
          : chat
      )
    );
  }, [lastMessage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect with sellers and manage your conversations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[70vh]">
            <div className="w-[320px] border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="p-4 text-sm text-gray-500">Loading conversations...</div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  chats.map((chat) => {
                    const isActive =
                      selectedChat?.conversationId === chat.conversationId;
                    return (
                      <button
                        key={chat.conversationId}
                        onClick={() => handleChatSelect(chat)}
                        className={`w-full text-left px-4 py-4 transition hover:bg-amber-50 ${
                          isActive ? "bg-amber-50 border-r-2 border-amber-600" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={chat.seller?.avatar || "https://res.cloudinary.com/duqrxy27h/image/upload/v1761315207/seller_default_zvuzfg.png"}
                              alt={chat.seller?.name}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-gray-200 w-10 h-10 object-cover"
                            />
                            {chat.seller?.isOnline && (
                              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {chat.seller?.name}
                              </span>
                              {chat?.unreadCount > 0 && (
                                <span className="ml-2 text-xs bg-amber-600 text-white px-2 py-1 rounded-full">
                                  {chat?.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {getLastMessage(chat)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          <div className="flex flex-col flex-1 bg-white">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={selectedChat.seller?.avatar || "https://res.cloudinary.com/duqrxy27h/image/upload/v1761315207/seller_default_zvuzfg.png"}
                      alt={selectedChat?.seller?.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-gray-200 w-10 h-10 object-cover"
                    />
                    {selectedChat.seller?.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-semibold text-base">
                      {selectedChat.seller?.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.seller?.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div
                  ref={messageContainerRef}
                  className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-sm"
                >
                  {hasMore && (
                    <div className="flex justify-center mb-2">
                      <button
                        onClick={loadMoreMessages}
                        className="text-xs px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Load previous messages
                      </button>
                    </div>
                  )}

                  {messages?.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        msg.senderType === "user"
                          ? "items-end ml-auto"
                          : "items-start"
                      } max-w-[80%]`}
                    >
                      <div
                        className={`${
                          msg.senderType === "user"
                            ? "bg-amber-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        } px-4 py-2 rounded-lg shadow-sm w-fit`}
                      >
                        {msg.text || msg.content}
                      </div>
                      <div
                        className={`text-[11px] text-gray-400 mt-1 flex items-center ${
                          msg.senderType === "user"
                            ? "mr-1 justify-end"
                            : "ml-1"
                        }`}
                      >
                        {msg.time ||
                          new Date(msg.createdAt).toLocaleDateString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollAnchorRef} />
                </div>

                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSend}
                  disabled={!wsReady}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
