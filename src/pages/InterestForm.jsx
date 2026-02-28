import { useState } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function InterestForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    businessType: "",
    companySize: "",
    primaryUseCase: "",
    accessLevel: "",
    additionalNotes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("Thank you for your interest! We've added you to our priority list.");
      navigate("/"); 
    } catch (err) {
      console.error("Firestore Error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    /* 1. MAIN OUTER WRAPPER: Handles horizontal and vertical centering */
    <div style={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      minHeight: "100vh",       
      backgroundColor: "#f7fafc",
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      boxSizing: "border-box",
      paddingLeft: "20px",    
      marginLeft: "50%", 
      marginRight: "100%"
    }}>

      {/* 2. CONTENT WRAPPER: Limits width and keeps everything aligned */}
      <div style={{
        maxWidth: "800px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center" // Ensures the header stays centered over the form
      }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", color: "#860aa5", marginBottom: "10px" }}>
            Exclusive Access & Custom Solutions
          </h2>
          <p style={{ color: "#718096", lineHeight: "1.6" }}>
            We are currently scaling our specialized AI toolsets. Fill out the details below to join our 
            priority waitlist for private access, enterprise features, or custom SaaS development.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "20px",
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {/* Form Fields */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Full Name *</label>
            <input required style={fieldStyle} placeholder="John Doe" 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Email Address *</label>
            <input type="email" required style={fieldStyle} placeholder="john@company.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Phone Number</label>
            <input style={fieldStyle} placeholder="(555) 000-0000" 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Company Name</label>
            <input style={fieldStyle} placeholder="Acme Corp" 
              onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Website or Social Link</label>
            <input style={fieldStyle} placeholder="https://..." 
              onChange={(e) => setFormData({...formData, website: e.target.value})} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Business Type</label>
            <select required style={fieldStyle} onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
              <option value="">Select Industry...</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Marketing">Marketing</option>
              <option value="Consulting">Consulting</option>
              <option value="Trades">Trades (HVAC, Roofing, etc.)</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Company Size</label>
            <select required style={fieldStyle} onChange={(e) => setFormData({...formData, companySize: e.target.value})}>
              <option value="">Select Size...</option>
              <option value="Solo">Solo</option>
              <option value="2-5">2–5 employees</option>
              <option value="6-20">6–20 employees</option>
              <option value="21-50">21–50 employees</option>
              <option value="51+">51+ employees</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Primary Use Case</label>
            <select required style={fieldStyle} onChange={(e) => setFormData({...formData, primaryUseCase: e.target.value})}>
              <option value="">Select Use Case...</option>
              <option value="Content creation">Content Creation</option>
              <option value="Automation">Process Automation</option>
              <option value="Onboarding">Client Onboarding</option>
              <option value="Customer communication">Customer Communication</option>
              <option value="Analytics">Data Analytics</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Access Level Interest</label>
            <select required style={fieldStyle} onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}>
              <option value="">Select Interest...</option>
              <option value="Private Single Tool">Private Access to a Single Tool</option>
              <option value="Full Access">Full Access to All Tools</option>
              <option value="Enterprise">Enterprise-Level Access</option>
              <option value="Not Sure">Not Sure Yet (Need Guidance)</option>
            </select>
          </div>

          {/* Footer / Buttons */}
          <div style={{ gridColumn: "span 2", marginTop: "20px" }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", padding: "15px", background: "#860aa5", color: "white", 
                border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", 
                cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(134, 10, 165, 0.2)"
              }}
            >
              {loading ? "Registering Interest..." : "Join Priority Waitlist"}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate("/")} 
              style={{ 
                width: "100%", background: "none", border: "none", color: "#718096", 
                marginTop: "15px", cursor: "pointer", textDecoration: "underline" 
              }}
            >
              Return to Tools
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}