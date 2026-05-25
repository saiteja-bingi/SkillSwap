import { useState, useEffect, useContext, useRef } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import socket from "../services/socket";
import { 
    Send, 
    Search, 
    ArrowLeft, 
    Smile, 
    Paperclip, 
    MessageSquare, 
    Check, 
    CheckCheck 
} from "lucide-react";

function Messages() {
    const { user } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [unreadConversations, setUnreadConversations] = useState({});
    const [onlineUsersList, setOnlineUsersList] = useState([]);

    const messagesEndRef = useRef(null);
    const selectedConversationRef = useRef(null);

    // Keep the ref updated with selected conversation to avoid stale closures in listeners
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    // Request notification permission on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // socket + conversations setup
    useEffect(() => {
        if (!user) return;

        socket.connect();
        socket.emit("register_user", user._id);

        const fetchConversations = async () => {
            try {
                const response = await api.get("/chat/my-conversations");
                setConversations(response.data.conversations || []);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();

        const handleReceiveMessage = (data) => {
            const msgConvId = data.conversation?._id || data.conversation;
            const currentSelected = selectedConversationRef.current;

            // 1. Move conversation to top and update preview text
            setConversations((prevConvs) => {
                const convIndex = prevConvs.findIndex((c) => c._id === msgConvId);
                const updatedConvs = [...prevConvs];

                if (convIndex !== -1) {
                    const targetConv = { ...updatedConvs[convIndex] };
                    targetConv.lastMessage = data.text;
                    targetConv.lastMessageTime = data.createdAt || new Date().toISOString();
                    
                    updatedConvs.splice(convIndex, 1);
                    updatedConvs.unshift(targetConv);
                }
                return updatedConvs;
            });

            // 2. If it's the active conversation, append message; otherwise increment unread count
            if (currentSelected && currentSelected._id === msgConvId) {
                setMessages((prevMsgs) => {
                    // Check if there is an exact ID match (real DB message already loaded)
                    const hasRealMsg = prevMsgs.some(m => m._id === data._id);
                    if (hasRealMsg) return prevMsgs;

                    // Check if there is a temporary optimistic message matching this message
                    const tempIndex = prevMsgs.findIndex(
                        (m) =>
                            m._id && String(m._id).startsWith("temp-") &&
                            m.text === data.text &&
                            m.sender?._id === data.sender?._id
                    );

                    if (tempIndex !== -1) {
                        // Replace the temp message with the actual DB message
                        const updated = [...prevMsgs];
                        updated[tempIndex] = data;
                        return updated;
                    }

                    // Otherwise, it's a completely new incoming message, append it
                    return [...prevMsgs, data];
                });

                // Trigger notification if tab is hidden/minimized
                if (document.hidden && data.sender?._id !== user._id && "Notification" in window && Notification.permission === "granted") {
                    new Notification(`New message from ${data.sender?.name || "SkillSwap"}`, {
                        body: data.text,
                        icon: "/favicon.ico"
                    });
                }
            } else {
                setUnreadConversations((prevUnread) => ({
                    ...prevUnread,
                    [msgConvId]: (prevUnread[msgConvId] || 0) + 1,
                }));

                // Push browser notification for background chats
                if (data.sender?._id !== user._id && "Notification" in window && Notification.permission === "granted") {
                    new Notification(`New message from ${data.sender?.name || "SkillSwap"}`, {
                        body: data.text,
                        icon: "/favicon.ico"
                    });
                }
            }
        };

        const handleGetOnlineUsers = (users) => {
            setOnlineUsersList(users || []);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("get_online_users", handleGetOnlineUsers);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("get_online_users", handleGetOnlineUsers);
        };
    }, [user]);

    // fetch messages when active conversation changes
    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            try {
                const response = await api.get(`/chat/messages/${selectedConversation._id}`);
                const msgs = response.data.messages || [];
                setMessages(msgs);

                // Set the last message preview for the selected conversation from the fetched messages
                if (msgs.length > 0) {
                    const lastMsg = msgs[msgs.length - 1];
                    setConversations((prevConvs) =>
                        prevConvs.map((c) =>
                            c._id === selectedConversation._id
                                ? { 
                                      ...c, 
                                      lastMessage: lastMsg.text,
                                      lastMessageTime: lastMsg.createdAt 
                                  }
                                : c
                        )
                    );
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Clear unread count for this conversation
        setUnreadConversations((prevUnread) => ({
            ...prevUnread,
            [selectedConversation._id]: 0,
        }));
    }, [selectedConversation]);

    // auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // send message function
    const sendMessage = () => {
        if (!selectedConversation || !newMessage.trim()) return;

        const receiver = selectedConversation.participants.find(
            (participant) => participant._id !== user._id
        );

        if (!receiver) return;

        const tempMessageId = "temp-" + Date.now();
        const tempMessage = {
            _id: tempMessageId,
            text: newMessage,
            sender: {
                _id: user._id,
                name: user.name,
            },
            createdAt: new Date().toISOString(),
        };

        // Optimistic UI updates
        setMessages((prev) => [...prev, tempMessage]);

        setConversations((prevConvs) => {
            const convIndex = prevConvs.findIndex((c) => c._id === selectedConversation._id);
            const updatedConvs = [...prevConvs];

            if (convIndex !== -1) {
                const targetConv = { ...updatedConvs[convIndex] };
                targetConv.lastMessage = newMessage;
                targetConv.lastMessageTime = new Date().toISOString();

                updatedConvs.splice(convIndex, 1);
                updatedConvs.unshift(targetConv);
            }
            return updatedConvs;
        });

        socket.emit("private_message", {
            senderId: user._id,
            receiverId: receiver._id,
            conversationId: selectedConversation._id,
            text: newMessage,
        });

        setNewMessage("");
    };

    // enter key triggers send
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // helper: initials avatar background color generator
    const getAvatarStyle = (name) => {
        const colors = [
            "linear-gradient(135deg, #f43f5e, #be123c)", // Rose/Red
            "linear-gradient(135deg, #ec4899, #be185d)", // Pink
            "linear-gradient(135deg, #a855f7, #6d28d9)", // Purple
            "linear-gradient(135deg, #6366f1, #4338ca)", // Indigo
            "linear-gradient(135deg, #3b82f6, #1d4ed8)", // Blue
            "linear-gradient(135deg, #06b6d4, #0891b2)", // Cyan
            "linear-gradient(135deg, #10b981, #047857)", // Emerald
            "linear-gradient(135deg, #f59e0b, #b45309)", // Amber
        ];
        if (!name) return { background: colors[0] };
        const charCode = name.charCodeAt(0) || 0;
        const colorIndex = charCode % colors.length;
        return { background: colors[colorIndex] };
    };

    // helper: format timestamp to HH:MM AM/PM
    const formatTime = (createdAt) => {
        const date = createdAt ? new Date(createdAt) : new Date();
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // helper: format date divider header
    const formatDateDivider = (dateStr) => {
        return dateStr;
    };

    // group messages by date
    const getGroupedMessages = () => {
        const groups = [];
        let lastDateStr = null;

        messages.forEach((msg) => {
            const date = msg.createdAt ? new Date(msg.createdAt) : new Date();
            const dateStr = date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            let displayDate = dateStr;
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                displayDate = "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                displayDate = "Yesterday";
            }

            if (displayDate !== lastDateStr) {
                groups.push({ type: "date", date: displayDate });
                lastDateStr = displayDate;
            }

            groups.push({ type: "message", data: msg });
        });

        return groups;
    };

    // filter conversations list by search query
    const filteredConversations = conversations.filter((conv) => {
        const otherUser = conv.participants.find((p) => p._id !== user._id);
        return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const activeChatClass = selectedConversation ? " active-chat" : "";

    return (
        <div className={`telegram-layout${activeChatClass}`}>
            
            {/* SIDEBAR */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <div className="chat-sidebar-title">Messages</div>
                    <div className="chat-search-wrapper">
                        <Search size={16} className="chat-search-icon" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="chat-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="chat-list">
                    {filteredConversations.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>
                            No chats found
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const otherUser = conv.participants.find(
                                (participant) => participant._id !== user._id
                            );
                            const isActive = selectedConversation?._id === conv._id;
                            const unreadCount = unreadConversations[conv._id] || 0;
                            const initials = otherUser?.name ? String(otherUser.name).charAt(0).toUpperCase() : "U";
                            const isOnline = otherUser?._id ? onlineUsersList.includes(otherUser._id) : false;

                            const displayPreview = conv.lastMessage || "Open chat history";
                            const displayTime = conv.lastMessageTime 
                                ? formatTime(conv.lastMessageTime)
                                : "";

                            return (
                                <div
                                    key={conv._id}
                                    className={`chat-item${isActive ? " active" : ""}`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <div className="chat-avatar-wrapper">
                                        <div 
                                            className="chat-avatar" 
                                            style={getAvatarStyle(otherUser?.name)}
                                        >
                                            {initials}
                                        </div>
                                        <div className={`chat-avatar-status${isOnline ? "" : " offline"}`}></div>
                                    </div>

                                    <div className="chat-item-details">
                                        <div className="chat-item-header">
                                            <div className="chat-item-name">{otherUser?.name}</div>
                                            {displayTime && (
                                                <div className="chat-item-time">{displayTime}</div>
                                            )}
                                        </div>
                                        <div className="chat-item-body">
                                            <div className="chat-item-preview">{displayPreview}</div>
                                            {unreadCount > 0 && (
                                                <div className="chat-item-unread">{unreadCount}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* CHAT AREA */}
            {selectedConversation ? (
                <div className="chat-main">
                    
                    {/* CHAT HEADER */}
                    <div className="chat-main-header">
                        <div className="chat-header-user">
                            <button 
                                className="chat-back-btn"
                                onClick={() => setSelectedConversation(null)}
                            >
                                <ArrowLeft size={20} />
                            </button>

                            {(() => {
                                const otherUser = selectedConversation.participants.find(
                                    (p) => p._id !== user._id
                                );
                                const isOnline = otherUser?._id ? onlineUsersList.includes(otherUser._id) : false;
                                return (
                                    <>
                                        <div className="chat-avatar-wrapper">
                                            <div 
                                                className="chat-avatar" 
                                                style={{
                                                    ...getAvatarStyle(otherUser?.name),
                                                    width: "40px",
                                                    height: "40px",
                                                    fontSize: "1rem"
                                                }}
                                            >
                                                {otherUser?.name ? String(otherUser.name).charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className={`chat-avatar-status${isOnline ? "" : " offline"}`} style={{ bottom: "0", right: "0", width: "8px", height: "8px" }}></div>
                                        </div>

                                        <div className="chat-header-info">
                                            <div className="chat-header-name">
                                                {otherUser?.name || "Chat"}
                                            </div>
                                            <div className={`chat-header-status${isOnline ? "" : " offline"}`}>
                                                {isOnline ? "online" : "offline"}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* MESSAGES CONTAINER */}
                    <div className="chat-body-container">
                        {getGroupedMessages().map((item, index) => {
                            if (item.type === "date") {
                                return (
                                    <div key={`date-${index}`} className="date-divider">
                                        {formatDateDivider(item.date)}
                                    </div>
                                );
                            }

                            const msg = item.data;
                            const isMyMessage = msg.sender?._id === user._id;
                            const isTemp = msg._id && String(msg._id).startsWith("temp-");

                            return (
                                <div
                                    key={msg._id || index}
                                    className={`message-bubble-row ${isMyMessage ? "mine" : "other"}`}
                                >
                                    <div className={`message-bubble ${isMyMessage ? "mine" : "other"}`}>
                                        <div>{msg.text}</div>
                                        <div className={`message-meta ${isMyMessage ? "message-meta-mine" : "message-meta-other"}`}>
                                            <span>{formatTime(msg.createdAt)}</span>
                                            {isMyMessage && (
                                                isTemp ? (
                                                    <Check size={12} style={{ opacity: 0.6 }} />
                                                ) : (
                                                    <CheckCheck size={12} style={{ color: "#a5f3fc" }} />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* CHAT INPUT AREA */}
                    <div className="chat-input-area">
                        <button className="chat-action-btn"><Paperclip size={20} /></button>
                        
                        <div className="chat-input-container">
                            <input
                                type="text"
                                placeholder="Write a message..."
                                className="chat-input-field"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="chat-action-btn" style={{ marginRight: "4px" }}><Smile size={20} /></button>
                        </div>

                        <button 
                            className="chat-send-btn"
                            onClick={sendMessage}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                /* EMPTY STATE / CHAT PLACEHOLDER */
                <div className="chat-placeholder">
                    <div className="chat-placeholder-icon-wrapper">
                        <MessageSquare size={36} />
                    </div>
                    <div className="chat-placeholder-title">Your Messages</div>
                    <div className="chat-placeholder-desc">
                        Select a chat from the left menu or start a swap conversation to begin swapping skills.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;