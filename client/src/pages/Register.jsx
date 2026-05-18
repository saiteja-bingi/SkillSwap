import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skillsOffered: "",
    skillsWanted: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    // convert comma separated strings to arrays
    const payload = {
      ...formData,
      skillsOffered: formData.skillsOffered.split(",").map(s => s.trim()).filter(s => s),
      skillsWanted: formData.skillsWanted.split(",").map(s => s.trim()).filter(s => s),
    };

    try {
      await api.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "2rem 0" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join SkillSwap and start sharing knowledge</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Skills You Offer (comma separated)</label>
            <input
              type="text"
              name="skillsOffered"
              placeholder="e.g. React, Python, Guitar"
              value={formData.skillsOffered}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Skills You Want (comma separated)</label>
            <input
              type="text"
              name="skillsWanted"
              placeholder="e.g. Spanish, UI Design, Marketing"
              value={formData.skillsWanted}
              onChange={handleChange}
            />
          </div>

          {error && <div style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center", fontSize: "0.875rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <UserPlus size={18} /> {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-primary)" }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;