import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { 
  User, 
  Activity, 
  Bell, 
  Plus, 
  Trash2, 
  Briefcase, 
  Send, 
  Inbox, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight
} from "lucide-react";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState("offers"); // "offers", "incoming", "outgoing"
  const [newPost, setNewPost] = useState({ title: "", description: "", skillOffered: "", skillWanted: "" });

  // Skills Editing state
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editSkills, setEditSkills] = useState({ skillsOffered: "", skillsWanted: "" });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [postsRes, requestsRes] = await Promise.all([
          api.get("/posts/mine"),
          api.get("/requests/my")
        ]);
        setPosts(postsRes.data || []);
        setSentRequests(requestsRes.data?.sentRequests || []);
        setReceivedRequests(requestsRes.data?.recievedRequests || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchDashboardData();
      
      // Initialize edit fields
      setEditSkills({
        skillsOffered: Array.isArray(user.skillsOffered) ? user.skillsOffered.join(", ") : "",
        skillsWanted: Array.isArray(user.skillsWanted) ? user.skillsWanted.join(", ") : ""
      });
    }
  }, [user]);

  async function handleCreatePost(e) {
    e.preventDefault();
    try {
      const res = await api.post("/posts", newPost);
      setPosts([res.data.post, ...posts]);
      setShowPostForm(false);
      setNewPost({ title: "", description: "", skillOffered: "", skillWanted: "" });
      setActiveTab("offers"); // switch back to offers tab to see new post
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating post");
    }
  }

  async function handleDeletePost(postId) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRequestAction(requestId, action) {
    try {
      await api.put(`/requests/${requestId}/${action}`);
      // Refresh requests efficiently
      const requestsRes = await api.get("/requests/my");
      setSentRequests(requestsRes.data?.sentRequests || []);
      setReceivedRequests(requestsRes.data?.recievedRequests || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Error to ${action} request`);
    }
  }

  async function handleSaveSkills(e) {
    e.preventDefault();
    try {
      const offeredArray = editSkills.skillsOffered
        .split(",")
        .map(s => s.trim())
        .filter(s => s);
      const wantedArray = editSkills.skillsWanted
        .split(",")
        .map(s => s.trim())
        .filter(s => s);

      const res = await api.put("/auth/profile", {
        skillsOffered: offeredArray,
        skillsWanted: wantedArray
      });

      setUser(res.data);
      setIsEditingSkills(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving profile skills");
    }
  }

  if (!user) return <div className="page-container" style={{ padding: "3rem", textAlign: "center" }}>Loading profile...</div>;

  // Calculate Dashboard metrics
  const activeOffersCount = posts.length;
  const pendingIncomingCount = receivedRequests.filter(r => r.status === "pending").length;
  const sentRequestsCount = sentRequests.length;
  const completedSwapsCount = [
    ...sentRequests,
    ...receivedRequests
  ].filter(r => r.status === "accepted").length;

  const initials = user.name ? String(user.name).charAt(0).toUpperCase() : "U";

  return (
    <div className="page-container" style={{ paddingBottom: "3rem" }}>
      <h1 className="page-title">Dashboard</h1>
      
      {/* 1. STATISTICS COUNTERS GRID */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-icon-wrapper purple">
            <Briefcase size={22} />
          </div>
          <div className="stats-card-info">
            <div className="stats-card-num">{activeOffersCount}</div>
            <div className="stats-card-label">Active Offers</div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon-wrapper cyan">
            <Send size={22} />
          </div>
          <div className="stats-card-info">
            <div className="stats-card-num">{sentRequestsCount}</div>
            <div className="stats-card-label">Requests Sent</div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
            <Inbox size={22} />
          </div>
          <div className="stats-card-info">
            <div className="stats-card-num">{pendingIncomingCount}</div>
            <div className="stats-card-label">Pending Received</div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon-wrapper emerald">
            <CheckCircle size={22} />
          </div>
          <div className="stats-card-info">
            <div className="stats-card-num">{completedSwapsCount}</div>
            <div className="stats-card-label">Completed Swaps</div>
          </div>
        </div>
      </div>

      {/* 2. SPLIT WORKSPACE LAYOUT */}
      <div className="dashboard-split-layout">
        
        {/* LEFT COLUMN: Profile and Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* User Profile Summary Card */}
          <div className="dashboard-user-summary">
            <div className="dashboard-avatar">{initials}</div>
            <div>
              <div className="dashboard-user-name">{user.name}</div>
              <div className="dashboard-user-email">{user.email}</div>
            </div>
            
            {isEditingSkills ? (
              <form onSubmit={handleSaveSkills} style={{ width: "100%", textAlign: "left", marginTop: "1rem" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Skills Offered (comma separated)
                  </label>
                  <input 
                    type="text" 
                    value={editSkills.skillsOffered} 
                    onChange={e => setEditSkills({...editSkills, skillsOffered: e.target.value})} 
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", marginBottom: 0 }}
                    placeholder="React, node, CSS..."
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Skills Wanted (comma separated)
                  </label>
                  <input 
                    type="text" 
                    value={editSkills.skillsWanted} 
                    onChange={e => setEditSkills({...editSkills, skillsWanted: e.target.value})} 
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", marginBottom: 0 }}
                    placeholder="Python, Django, UI Design..."
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", flex: 1 }}>Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditingSkills(false)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", flex: 1 }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ width: "100%", borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "left" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "bold" }}>Skills Offered</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                        {Array.isArray(user.skillsOffered) && user.skillsOffered.length > 0 ? (
                          user.skillsOffered.map((s, i) => <span key={i} className="badge badge-primary" style={{ fontSize: "0.75rem" }}>{s}</span>)
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>None listed</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "bold" }}>Skills Wanted</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                        {Array.isArray(user.skillsWanted) && user.skillsWanted.length > 0 ? (
                          user.skillsWanted.map((s, i) => <span key={i} className="badge badge-secondary" style={{ fontSize: "0.75rem" }}>{s}</span>)
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>None listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditingSkills(true)}
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.85rem", marginTop: "0.5rem" }}
                >
                  Edit Profile Skills
                </button>
              </>
            )}
          </div>

          {/* Quick Offer Creation Form Card */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: 0 }}>Manage Swap Offers</h3>
              <button 
                onClick={() => setShowPostForm(!showPostForm)} 
                className={`btn ${showPostForm ? 'btn-secondary' : 'btn-primary'}`} 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", display: "flex", gap: "4px" }}
              >
                {showPostForm ? "Close Form" : <><Plus size={14} /> New Offer</>}
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handleCreatePost} className="post-form-card" style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Offer Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Will teach JavaScript" 
                      required 
                      value={newPost.title} 
                      onChange={e => setNewPost({...newPost, title: e.target.value})} 
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Description</label>
                    <textarea 
                      placeholder="Detail what you offer and what you are looking for..." 
                      required 
                      rows="3" 
                      value={newPost.description} 
                      onChange={e => setNewPost({...newPost, description: e.target.value})}
                      style={{ marginBottom: 0 }}
                    ></textarea>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Offered Skill</label>
                      <input 
                        type="text" 
                        placeholder="React" 
                        required 
                        value={newPost.skillOffered} 
                        onChange={e => setNewPost({...newPost, skillOffered: e.target.value})}
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Wanted Skill</label>
                      <input 
                        type="text" 
                        placeholder="Python" 
                        required 
                        value={newPost.skillWanted} 
                        onChange={e => setNewPost({...newPost, skillWanted: e.target.value})}
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem", width: "100%", marginTop: "0.5rem" }}>
                    Publish Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Tabbed Content Area */}
        <div className="glass-panel" style={{ padding: "2rem", minHeight: "450px" }}>
          
          {/* Section tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`dashboard-tab-btn${activeTab === "offers" ? " active" : ""}`}
              onClick={() => setActiveTab("offers")}
            >
              <Activity size={16} />
              <span>My Offers</span>
              <span className="dashboard-tab-count">{activeOffersCount}</span>
            </button>
            
            <button 
              className={`dashboard-tab-btn${activeTab === "incoming" ? " active" : ""}`}
              onClick={() => setActiveTab("incoming")}
            >
              <Inbox size={16} />
              <span>Incoming Requests</span>
              <span className="dashboard-tab-count">{receivedRequests.length}</span>
            </button>
            
            <button 
              className={`dashboard-tab-btn${activeTab === "outgoing" ? " active" : ""}`}
              onClick={() => setActiveTab("outgoing")}
            >
              <Send size={16} />
              <span>Sent Requests</span>
              <span className="dashboard-tab-count">{sentRequestsCount}</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE OFFERS LIST */}
          {activeTab === "offers" && (
            <div>
              {loading ? (
                <p>Loading offers...</p>
              ) : posts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon-wrapper">
                    <Briefcase size={40} />
                  </div>
                  <div className="empty-state-title">No Active Offers</div>
                  <div className="empty-state-desc">
                    You haven't posted any skills to swap yet. Use the quick form to publish your first offer!
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {posts.map(post => (
                    <div key={post._id} className="glass-card" style={{ padding: "1.25rem", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <h3 className="text-xl font-bold" style={{ fontSize: "1.1rem" }}>{post.title}</h3>
                        <button 
                          onClick={() => handleDeletePost(post._id)} 
                          style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "0.25rem" }}
                          title="Delete offer"
                        >
                          <Trash2 size={16} style={{ transition: "color 0.2s" }} className="hover-red-icon" />
                        </button>
                      </div>
                      <p className="text-gray-300 mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>{post.description}</p>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className="badge badge-primary">Offers: {post.skillOffered}</span>
                        <ArrowRight size={14} style={{ color: "var(--text-secondary)" }} />
                        <span className="badge badge-secondary">Wants: {post.skillWanted}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCOMING SWAP REQUESTS */}
          {activeTab === "incoming" && (
            <div>
              {loading ? (
                <p>Loading incoming requests...</p>
              ) : receivedRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon-wrapper">
                    <Inbox size={40} />
                  </div>
                  <div className="empty-state-title">No Incoming Requests</div>
                  <div className="empty-state-desc">
                    No swap requests received yet. Other community members will request your offers when they discover them in the feed.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {receivedRequests.map(req => {
                    const senderName = req.sender?.name || "Anonymous Member";
                    const isPending = req.status === "pending";
                    const isAccepted = req.status === "accepted";
                    const isRejected = req.status === "rejected";

                    return (
                      <div key={req._id} className="request-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "0.75rem" }}>
                          <div>
                            <span style={{ color: "var(--accent-secondary)", fontWeight: "600", fontSize: "0.95rem" }}>{senderName}</span>
                            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}> wants to swap for your:</span>
                            <div style={{ marginTop: "4px", fontSize: "0.95rem" }} className="request-post-title">
                              {req.post?.title || "a deleted post"}
                            </div>
                          </div>
                          
                          {/* Action badge */}
                          {!isPending && (
                            <span className="badge" style={{ 
                              background: isAccepted ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                              color: isAccepted ? "#10b981" : "#ef4444",
                              border: isAccepted ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)"
                            }}>
                              {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                            </span>
                          )}
                        </div>

                        {req.post && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontSize: "0.8rem", marginBottom: "1rem", opacity: 0.8 }}>
                            <span className="badge badge-primary" style={{ padding: "2px 6px" }}>Offers: {req.post.skillOffered}</span>
                            <ArrowRight size={12} style={{ color: "var(--text-secondary)" }} />
                            <span className="badge badge-secondary" style={{ padding: "2px 6px" }}>Wants: {req.post.skillWanted}</span>
                          </div>
                        )}

                        {isPending && (
                          <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                            <button 
                              onClick={() => handleRequestAction(req._id, 'accept')} 
                              className="btn btn-primary" 
                              style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", display: "flex", gap: "4px" }}
                            >
                              <CheckCircle size={14} /> Accept
                            </button>
                            <button 
                              onClick={() => handleRequestAction(req._id, 'reject')} 
                              className="btn btn-secondary" 
                              style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", display: "flex", gap: "4px" }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OUTGOING SWAP REQUESTS */}
          {activeTab === "outgoing" && (
            <div>
              {loading ? (
                <p>Loading outgoing requests...</p>
              ) : sentRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon-wrapper">
                    <Send size={40} />
                  </div>
                  <div className="empty-state-title">No Sent Requests</div>
                  <div className="empty-state-desc">
                    You haven't requested any swaps yet. Head over to the Skill Feed to find skills you want to learn!
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {sentRequests.map(req => {
                    const receiverName = req.receiver?.name || "Anonymous Member";
                    const isPending = req.status === "pending";
                    const isAccepted = req.status === "accepted";
                    const isRejected = req.status === "rejected";

                    return (
                      <div key={req._id} className="request-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "0.75rem" }}>
                          <div>
                            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Sent swap request to </span>
                            <span style={{ color: "var(--accent-secondary)", fontWeight: "600", fontSize: "0.95rem" }}>{receiverName}</span>
                            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}> for:</span>
                            <div style={{ marginTop: "4px", fontSize: "0.95rem" }} className="request-post-title">
                              {req.post?.title || "a deleted post"}
                            </div>
                          </div>
                          
                          {/* Status badge */}
                          <span className="badge" style={{ 
                            background: isAccepted 
                              ? "rgba(16, 185, 129, 0.1)" 
                              : isRejected 
                              ? "rgba(239, 68, 68, 0.1)" 
                              : "rgba(245, 158, 11, 0.1)",
                            color: isAccepted ? "#10b981" : isRejected ? "#ef4444" : "#f59e0b",
                            border: isAccepted 
                              ? "1px solid rgba(16, 185, 129, 0.2)" 
                              : isRejected 
                              ? "1px solid rgba(239, 68, 68, 0.2)" 
                              : "1px solid rgba(245, 158, 11, 0.2)"
                          }}>
                            {isPending ? (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Clock size={12} /> Pending
                              </span>
                            ) : req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                          </span>
                        </div>

                        {req.post && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontSize: "0.8rem", opacity: 0.8 }}>
                            <span className="badge badge-primary" style={{ padding: "2px 6px" }}>Offers: {req.post.skillOffered}</span>
                            <ArrowRight size={12} style={{ color: "var(--text-secondary)" }} />
                            <span className="badge badge-secondary" style={{ padding: "2px 6px" }}>Wants: {req.post.skillWanted}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;