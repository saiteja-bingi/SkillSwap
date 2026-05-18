import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState({});

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/posts");
        setPosts(response.data?.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function handleRequest(postId) {
    try {
      setRequestStatus(prev => ({ ...prev, [postId]: { status: 'loading' } }));
      await api.post(`/requests/${postId}`, {});
      setRequestStatus(prev => ({ ...prev, [postId]: { status: 'sent' } }));
    } catch (err) {
      console.error(err);
      setRequestStatus(prev => ({ 
        ...prev, 
        [postId]: { status: 'error', message: err.response?.data?.message || 'Error' } 
      }));
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Skill Feed</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Browse skills offered by the community and request a swap.</p>
      
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="glass-panel"><p>No posts available at the moment.</p></div>
      ) : (
        <div className="grid">
          {posts.map((post) => {
            const isMyPost = user && (post.createdBy?._id === user._id || post.createdBy === user._id);
            return (
              <div key={post._id} className="glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  {isMyPost && <span className="badge" style={{ background: "rgba(139, 92, 246, 0.2)", color: "var(--accent-primary)" }}>Your Post</span>}
                </div>
                <p style={{ color: "var(--accent-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  Posted by: {post.createdBy?.name || 'Unknown User'}
                </p>
                <p className="text-gray-300 mb-4">{post.description}</p>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="badge badge-primary">Offers: {post.skillOffered}</span>
                <span className="badge badge-secondary">Wants: {post.skillWanted}</span>
              </div>
              
              <button 
                className="btn btn-primary w-full"
                onClick={() => handleRequest(post._id)}
                disabled={requestStatus[post._id]?.status === 'loading' || requestStatus[post._id]?.status === 'sent'}
                style={{ 
                  background: requestStatus[post._id]?.status === 'sent' ? "rgba(16, 185, 129, 0.2)" : requestStatus[post._id]?.status === 'error' ? "rgba(239, 68, 68, 0.2)" : "",
                  color: requestStatus[post._id]?.status === 'sent' ? "#10b981" : requestStatus[post._id]?.status === 'error' ? "#ef4444" : "",
                  boxShadow: (requestStatus[post._id]?.status === 'sent' || requestStatus[post._id]?.status === 'error') ? "none" : "",
                  border: requestStatus[post._id]?.status === 'error' ? "1px solid #ef4444" : "none"
                }}
              >
                {requestStatus[post._id]?.status === 'sent' ? "Request Sent" 
                  : requestStatus[post._id]?.status === 'loading' ? "Sending..." 
                  : requestStatus[post._id]?.status === 'error' ? requestStatus[post._id].message : "Request Swap"}
              </button>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Feed;
