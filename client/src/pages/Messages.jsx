import { useState, useEffect, useContext, useRef } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Send } from "lucide-react";

function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await api.get("/chat/my-conversations");
        setConversations(response.data?.conversations || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    async function fetchMessages() {
      setLoadingMsgs(true);
      try {
        const res = await api.get(`/chat/${activeConvId}/messages`);
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoadingMsgs(false);
      }
    }
    fetchMessages();
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;
    try {
      const res = await api.post(`/chat/${activeConvId}/message`, { text: newMessage });
      setMessages(prev => [...prev, res.data.data]);
      setNewMessage("");
      
      // refetch to ensure sender data is populated if needed
      const msgsRes = await api.get(`/chat/${activeConvId}/messages`);
      setMessages(msgsRes.data?.messages || []);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  if (!user) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container" style={{ height: "calc(100vh - 100px)", paddingTop: "1rem", paddingBottom: "1rem", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <h1 className="page-title" style={{ flexShrink: 0, marginBottom: "1rem" }}>Messages</h1>
      
      <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "2rem", flex: 1, minHeight: 0, paddingBottom: "1rem" }}>
        {/* Conversations List */}
        <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", paddingLeft: "0.5rem" }}>Conversations</h2>
          {loading ? <p>Loading...</p> : conversations.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", padding: "0.5rem" }}>No active conversations.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {conversations.map(conv => {
                const otherPerson = conv.participants.find(p => p._id !== user._id);
                return (
                  <div key={conv._id} onClick={() => setActiveConvId(conv._id)} style={{ 
                    padding: "1rem", 
                    borderRadius: "8px", 
                    background: activeConvId === conv._id ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.05)",
                    border: activeConvId === conv._id ? "1px solid var(--accent-primary)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  className="hover-bg"
                  >
                    <strong>{otherPerson?.name || "Unknown User"}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Chat Area */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!activeConvId ? (
            <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {loadingMsgs ? <p>Loading messages...</p> : messages.length === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "2rem" }}>No messages yet. Say hi!</p>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                    return (
                      <div key={msg._id} style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        padding: "0.75rem 1rem",
                        borderRadius: "1rem",
                        background: isMe ? "var(--accent-primary)" : "rgba(255,255,255,0.1)",
                        color: "white",
                        borderBottomRightRadius: isMe ? "0" : "1rem",
                        borderBottomLeftRadius: isMe ? "1rem" : "0"
                      }}>
                        <p>{msg.text}</p>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                  placeholder="Type a message..." 
                  className="form-input" 
                  style={{ flex: 1, marginBottom: 0 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", justifyContent: "center" }} disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
