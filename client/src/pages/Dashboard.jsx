import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { User, Activity, Bell, Plus, Trash2 } from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", description: "", skillOffered: "", skillWanted: "" });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [postsRes, requestsRes] = await Promise.all([
          api.get("/posts/mine"),
          api.get("/requests/my")
        ]);
        setPosts(postsRes.data || []);
        
        // combine sent and received requests safely
        const allRequests = [
          ...(requestsRes.data?.sentRequests || []), 
          ...(requestsRes.data?.recievedRequests || [])
        ];
        setRequests(allRequests);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function handleCreatePost(e) {
    e.preventDefault();
    try {
      const res = await api.post("/posts", newPost);
      setPosts([res.data.post, ...posts]);
      setShowPostForm(false);
      setNewPost({ title: "", description: "", skillOffered: "", skillWanted: "" });
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
      const allRequests = [
        ...(requestsRes.data?.sentRequests || []), 
        ...(requestsRes.data?.recievedRequests || [])
      ];
      setRequests(allRequests);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Error to ${action} request`);
    }
  }

  if (!user) return <div className="page-container" style={{ padding: "2rem" }}>Loading profile...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid" style={{ marginBottom: "1rem" }}>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
        {/* My Posts Column */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={20} color="var(--accent-primary)" /> My Active Posts
            </h2>
            <button className="btn btn-primary" onClick={() => setShowPostForm(!showPostForm)} style={{ padding: "0.5rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Plus size={16} /> New Post
            </button>
          </div>

          {showPostForm && (
            <form onSubmit={handleCreatePost} className="glass-card" style={{ marginBottom: "1rem", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
              <h3 className="text-xl font-bold mb-4">Create New Swap Offer</h3>
              <div className="form-group mb-3">
                <input type="text" placeholder="Title (e.g. Will teach React)" className="form-input" required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
              </div>
              <div className="form-group mb-3">
                <textarea placeholder="Description" className="form-input" required rows="3" value={newPost.description} onChange={e => setNewPost({...newPost, description: e.target.value})}></textarea>
              </div>
              <div className="grid mb-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <input type="text" placeholder="Skill Offered" className="form-input" required value={newPost.skillOffered} onChange={e => setNewPost({...newPost, skillOffered: e.target.value})} />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Skill Wanted" className="form-input" required value={newPost.skillWanted} onChange={e => setNewPost({...newPost, skillWanted: e.target.value})} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1rem", flex: 1 }}>Post Offer</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostForm(false)} style={{ padding: "0.5rem 1rem", flex: 1 }}>Cancel</button>
              </div>
            </form>
          )}

          {loading ? <p>Loading posts...</p> : !posts || posts.length === 0 ? (
            <div className="glass-card"><p style={{ color: "var(--text-secondary)" }}>You have no active posts.</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {posts.map(post => (
                <div key={post._id} className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <button onClick={() => handleDeletePost(post._id)} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "0.25rem" }}>
                      <Trash2 size={18} className="hover-icon" style={{ color: "var(--text-secondary)" }} />
                    </button>
                  </div>
                  <p className="text-gray-300 mb-2">{post.description}</p>
                  <div className="flex gap-2">
                     <span className="badge badge-primary">{post.skillOffered}</span>
                     <span className="badge badge-secondary">{post.skillWanted}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Requests Column */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={20} color="var(--accent-secondary)" /> Swap Requests
          </h2>
          {loading ? <p>Loading requests...</p> : !requests || requests.length === 0 ? (
            <div className="glass-card"><p style={{ color: "var(--text-secondary)" }}>No active requests.</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {requests.map(req => {
                const isReceiver = req.receiver?._id === user._id || req.receiver === user._id;
                const otherPersonName = isReceiver ? req.sender?.name : req.receiver?.name;

                return (
                  <div key={req._id} className="glass-card">
                    <p style={{ marginBottom: "0.5rem" }}>
                      <span style={{ color: "var(--accent-secondary)" }}>{otherPersonName || 'Someone'}</span> {isReceiver ? 'wants to swap for your' : 'received your swap request for'} <strong>{req.post?.title || 'a post'}</strong>
                    </p>
                    <div className="flex gap-2">
                      {req.status === "pending" && isReceiver ? (
                        <>
                          <button onClick={() => handleRequestAction(req._id, 'accept')} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Accept</button>
                          <button onClick={() => handleRequestAction(req._id, 'reject')} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Reject</button>
                        </>
                      ) : (
                        <span className="badge" style={{ background: req.status === "accepted" ? "rgba(16, 185, 129, 0.1)" : req.status === "rejected" ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.1)", color: req.status === "accepted" ? "#10b981" : req.status === "rejected" ? "#ef4444" : "#cbd5e1" }}>
                          {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;