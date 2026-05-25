import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import socket from "../services/socket";
import { 
  LogOut, 
  Home, 
  Grid, 
  MessageSquare, 
  LayoutDashboard, 
  Handshake, 
  Bell,
  Menu,
  X
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  // Request browser Notification permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
      async function fetchNotifications() {
        try {
          const res = await api.get("/notifications");
          setNotifications(res.data?.notifications || []);
        } catch (err) {
          console.error(err);
        }
      }
      fetchNotifications();
    }
  }, [user]);

  // Socket notification listener: appends received messages as notifications when not on /messages page
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("register_user", user._id);

    const handleReceiveMessageNotification = (data) => {
      // Only notify if user is NOT currently on the Messages page and did not send it
      if (location.pathname !== "/messages" && data.sender?._id !== user._id) {
        const newNotif = {
          _id: "notif-" + Date.now(),
          message: `${data.sender?.name} sent you a message: "${data.text.substring(0, 30)}${data.text.length > 30 ? '...' : ''}"`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        setNotifications((prev) => [newNotif, ...prev]);

        // Push desktop notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${data.sender?.name || "SkillSwap"}`, {
            body: data.text,
            icon: "/favicon.ico"
          });
        }
      }
    };

    socket.on("receive_message", handleReceiveMessageNotification);

    return () => {
      socket.off("receive_message", handleReceiveMessageNotification);
    };
  }, [user, location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleClearAll() {
    try {
      await api.delete("/notifications/clear-all");
      setNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      background: isActive ? "rgba(139, 92, 246, 0.2)" : "transparent",
      color: isActive ? "var(--accent-primary)" : "var(--text-primary)",
      transition: "all 0.2s",
      textDecoration: "none",
      fontWeight: isActive ? "600" : "400"
    };
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass-nav">
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} onClick={handleLinkClick}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          display: "flex", alignItems: "center", justifyContent: "center", color: "white"
        }}>
          <Handshake size={24} />
        </div>
        <h2 style={{ fontSize: "1.5rem", letterSpacing: "1px", display: "flex", alignItems: "center", margin: 0 }}>
          <span style={{ fontWeight: "800", color: "#ffffff" }}>Skill</span>
          <span style={{ fontWeight: "400", color: "var(--accent-primary)" }}>Swap</span>
        </h2>
      </Link>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        
        {/* Desktop links - collapse on mobile */}
        <div className="desktop-nav-menu">
          <Link to="/" style={getLinkStyle("/")}>
            <Home size={18} /> Home
          </Link>
          
          {user && (
            <>
              <Link to="/feed" style={getLinkStyle("/feed")}>
                <Grid size={18} /> Feed
              </Link>
              <Link to="/messages" style={getLinkStyle("/messages")}>
                <MessageSquare size={18} /> Messages
              </Link>
              <Link to="/dashboard" style={getLinkStyle("/dashboard")}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Desktop Guest Auth - collapse on mobile */}
        {!user && (
          <div className="desktop-nav-menu" style={{ display: "flex", gap: "10px" }}>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}

        {user && (
          <>
            {/* Notifications Dropdown (Always visible) */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ 
                  background: showNotifications ? "rgba(255,255,255,0.1)" : "transparent", 
                  border: "none", 
                  color: "white", 
                  cursor: "pointer", 
                  position: "relative", 
                  display: "flex", 
                  alignItems: "center",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  transition: "background 0.2s"
                }}
                className="hover-bg"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: "-2px", right: "-2px",
                    background: "var(--accent-secondary)", color: "white",
                    borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "bold"
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", top: "150%", right: "0",
                  width: "300px", maxHeight: "400px", overflowY: "auto",
                  background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                  padding: "1rem", zIndex: 1000, boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={handleClearAll} style={{ background: "transparent", border: "none", color: "var(--accent-secondary)", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>
                        Clear All
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No notifications.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {notifications.map(n => (
                        <div key={n._id} onClick={() => !n.isRead && markAsRead(n._id)} style={{
                          padding: "0.75rem", borderRadius: "8px",
                          background: n.isRead ? "rgba(255,255,255,0.05)" : "rgba(139, 92, 246, 0.2)",
                          cursor: n.isRead ? "default" : "pointer",
                          fontSize: "0.9rem"
                        }}>
                          <p style={{ color: n.isRead ? "var(--text-secondary)" : "white" }}>{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown (Always visible) */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                style={{ 
                  background: showProfile ? "rgba(255,255,255,0.1)" : "transparent", 
                  border: "none", 
                  color: "white", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  transition: "background 0.2s"
                }}
                className="hover-bg"
              >
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold"
                }}>
                  {user?.name ? String(user.name).charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontWeight: "500" }} className="desktop-nav-menu">
                  {user?.name ? String(user.name).split(' ')[0] : 'Profile'}
                </span>
              </button>

              {showProfile && (
                <div style={{
                  position: "absolute", top: "120%", right: "0",
                  width: "260px",
                  background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                  padding: "1.5rem", zIndex: 1000, boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ textAlign: "center", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "1rem" }}>
                    <div style={{
                      width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 0.75rem auto",
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: "bold", color: "white"
                    }}>
                      {user?.name ? String(user.name).charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3 style={{ fontSize: "1.2rem", margin: "0 0 0.25rem 0", fontWeight: "bold" }}>{user?.name || 'User'}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>{user?.email || ''}</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>Offers: {Array.isArray(user?.skillsOffered) ? user.skillsOffered.length : 0}</span>
                      <span className="badge badge-secondary" style={{ fontSize: "0.75rem" }}>Wants: {Array.isArray(user?.skillsWanted) ? user.skillsWanted.length : 0}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="btn btn-secondary w-full"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "0.75rem" }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>

    {/* Mobile Navigation Drawer (Moved outside <nav> to avoid parent stacking context opacity/filter rendering bugs) */}
    {mobileMenuOpen && (
      <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}></div>
    )}
    <div className={`mobile-drawer${mobileMenuOpen ? " open" : ""}`}>
      <div className="mobile-drawer-header">
        <h3 style={{ margin: 0, fontWeight: "800" }}>Navigation</h3>
        <button 
          className="mobile-drawer-close"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      <div className="mobile-drawer-links">
        <Link to="/" style={getLinkStyle("/")} onClick={handleLinkClick}>
          <Home size={18} /> Home
        </Link>
        
        {user ? (
          <>
            <Link to="/feed" style={getLinkStyle("/feed")} onClick={handleLinkClick}>
              <Grid size={18} /> Feed
            </Link>
            <Link to="/messages" style={getLinkStyle("/messages")} onClick={handleLinkClick}>
              <MessageSquare size={18} /> Messages
            </Link>
            <Link to="/dashboard" style={getLinkStyle("/dashboard")} onClick={handleLinkClick}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className="btn btn-secondary w-full"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "1.5rem" }}
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
            <Link to="/login" className="btn btn-secondary w-full" onClick={handleLinkClick}>Login</Link>
            <Link to="/register" className="btn btn-primary w-full" onClick={handleLinkClick}>Register</Link>
          </div>
        )}
      </div>
    </div>
  </>
);
}

export default Navbar;