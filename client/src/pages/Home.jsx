import { Link } from "react-router-dom";
import { ArrowRight, Zap, Users, ShieldCheck, MessageCircle, Code, Palette, Globe, Award, TrendingUp } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Hero Section */}
      <div className="page-container" style={{ textAlign: "center", paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: "-50px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", background: "var(--accent-primary)", filter: "blur(150px)", opacity: "0.2", zIndex: -1 }}></div>
          
          <div style={{ display: "inline-block", padding: "0.5rem 1rem", background: "rgba(139, 92, 246, 0.1)", color: "var(--accent-primary)", borderRadius: "2rem", marginBottom: "1.5rem", fontWeight: "bold", letterSpacing: "1px", fontSize: "0.9rem" }}>
            🚀 THE ULTIMATE SKILL EXCHANGE PLATFORM
          </div>

          <h1 style={{ fontSize: "4.5rem", fontWeight: "800", marginBottom: "1.5rem", lineHeight: "1.1", letterSpacing: "-1px" }}>
            Swap Skills, <br />
            <span style={{ background: "linear-gradient(to right, var(--accent-primary), #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Empower Your Future</span>
          </h1>
          
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            Join a global community where knowledge is the true currency. Trade your expertise for the skills you need to succeed—completely free.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", position: "relative", zIndex: 1 }}>
            {!user ? (
              <Link to="/register" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "30px", boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)" }}>
                Start Swapping <ArrowRight size={20} />
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "30px", boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)" }}>
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            )}
            <Link to="/feed" className="btn btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "30px" }}>
              Explore Skills
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="page-container" style={{ padding: "6rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Why Choose SkillSwap?</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>Everything you need to learn, connect, and grow without spending a dime.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)", marginBottom: "1.5rem" }}>
              <Zap size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Fast Matching</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Find the perfect skill swap partner instantly using our smart tagging and categorization system.</p>
          </div>

          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", marginBottom: "1.5rem" }}>
              <ShieldCheck size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Secure Swaps</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Our robust request system ensures both parties agree before any private chat channels are opened.</p>
          </div>

          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(236, 72, 153, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899", marginBottom: "1.5rem" }}>
              <MessageCircle size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Real-time Chat</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Communicate seamlessly with your learning partners using our built-in lightning-fast messaging system.</p>
          </div>

          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(59, 130, 246, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", marginBottom: "1.5rem" }}>
              <Users size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Global Community</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Learn from passionate experts and share your knowledge with eager learners from all over the world.</p>
          </div>

          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", marginBottom: "1.5rem" }}>
              <Award size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Verified Quality</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Build your reputation through successful swaps and earn badges to showcase your teaching excellence.</p>
          </div>

          <div className="glass-card hover-bg" style={{ padding: "2.5rem", transition: "transform 0.3s", cursor: "default" }}>
            <div style={{ background: "rgba(14, 165, 233, 0.1)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0ea5e9", marginBottom: "1.5rem" }}>
              <TrendingUp size={30} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Skill Tracking</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>Set goals, track your learning progress, and watch your skill portfolio grow over time.</p>
          </div>
        </div>
      </div>

      {/* How it Works / About Section */}
      <div style={{ background: "rgba(255,255,255,0.02)", padding: "6rem 2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1.5rem", lineHeight: "1.2" }}>About Our Mission</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.8" }}>
              We believe that education should be accessible to everyone, regardless of financial barriers. SkillSwap was founded on a simple premise: everyone has something to teach, and everyone has something to learn.
            </p>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.8" }}>
              By removing money from the equation, we've created a pure, collaborative environment where knowledge is the only currency. Whether you're a developer wanting to learn Spanish, or a designer needing help with marketing, your skills are valuable here.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}><div style={{ background: "var(--accent-primary)", borderRadius: "50%", padding: "5px" }}><Code size={16} color="white" /></div> Trade technical skills</li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}><div style={{ background: "var(--accent-secondary)", borderRadius: "50%", padding: "5px" }}><Palette size={16} color="white" /></div> Swap creative talents</li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}><div style={{ background: "#10b981", borderRadius: "50%", padding: "5px" }}><Globe size={16} color="white" /></div> Exchange languages</li>
            </ul>
          </div>
          
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "10%", right: "-10%", width: "200px", height: "200px", background: "var(--accent-secondary)", filter: "blur(100px)", opacity: "0.3", zIndex: -1 }}></div>
            <div className="glass-card" style={{ padding: "3rem", background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "2rem", textAlign: "center" }}>How It Works</h3>
              
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ background: "var(--accent-primary)", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Create Your Profile</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>List the skills you have to offer and the skills you want to learn.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ background: "var(--accent-primary)", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Find a Match</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Browse the Feed and send a swap request to a potential partner.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div style={{ background: "var(--accent-primary)", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Learn & Grow</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Chat, connect over video calls, and start exchanging knowledge!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer style={{ textAlign: "center", padding: "3rem 2rem 1rem 2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        <p>&copy; {new Date().getFullYear()} SkillSwap. Built with passion.</p>
      </footer>
    </div>
  );
};

export default Home;