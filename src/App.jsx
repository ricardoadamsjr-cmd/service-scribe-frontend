import { useState } from "react";
// 1. Import routing components
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import snapcopyLogo from "./assets/snapcopyLogo.png";

/** * NOTE: Ensure your file is located at src/pages/businessTools/onboarding.jsx
 * If it is inside the assets folder, use the path below.
 */
import Onboarding from "./pages/businessTools/onboarding.jsx";

/**
 * MAIN TOOL COMPONENT
 * This contains all your original logic and the orange button.
 */
function SnapCopyTool() {
  const navigate = useNavigate(); // Use this for internal routing

  // --- MODE SWITCH ---
  const [mode, setMode] = useState("about");

  // --- FORM STATE ---
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");
  const [originalPost, setOriginalPost] = useState("");
  const [comment, setComment] = useState("");
  const [tone, setTone] = useState("");
  const [rawComments, setRawComments] = useState("");

  // --- SHARED STATE ---
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const colors = {
    logobackground: "#592e72",
    deepBlue: "#860aa5",
    purple: "#390b64",
    darkSlate: "#2d3748",
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e",
    successGreen: "#38a169",
    orange: "#f97316",
    orangeHover: "#ea580c"
  };

  const descriptions = {
    about: "Craft a professional business bio that builds trust with your local audience.",
    responder: "Generate thoughtful, high-engagement replies to social media comments in seconds.",
    sentiment: "Analyze messy comment sections to identify customer feelings and key feedback trends."
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    borderRadius: "8px",
    border: `1px solid ${colors.lightGray}`,
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const getInputStyle = (isFocused) => ({
    ...inputStyle,
    borderColor: isFocused ? colors.deepBlue : colors.lightGray,
    boxShadow: isFocused ? `0 0 0 3px ${colors.deepBlue}33` : "none",
  });

  const handleModeSwitch = (newMode) => {
    setIndustry(""); setCity(""); setYears("");
    setOriginalPost(""); setComment(""); setTone("");
    setRawComments(""); setOutput(""); setError("");
    setCopied(false);
    setMode(newMode);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  async function generate() {
    setOutput(""); setError(""); setCopied(false);
    
    if (mode === "about" && (!industry.trim() || !city.trim() || !years.trim())) return setError("Fill out all About Us fields");
    if (mode === "responder" && (!originalPost.trim() || !comment.trim() || !tone.trim())) return setError("Fill out all Responder fields");
    if (mode === "sentiment" && !rawComments.trim()) return setError("Please paste the content");
    
    setLoading(true);
    let payload = { mode };
    if (mode === "about") payload = { ...payload, industry, city, years };
    else if (mode === "responder") payload = { ...payload, originalPost, comment, tone };
    else payload = { ...payload, rawComments };

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");
      const result = mode === "about" ? data.about : (mode === "responder" ? data.reply : data.sentiment);
      setOutput(result);
    } catch (err) {
      setError(err.message || "Could not reach the AI backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", width: "100vw",
      background: "#f0f2f5", padding: "20px", paddingTop: "10px", boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      {/* --- Logo --- */}
      <div style={{ width: 250, height: 250, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", paddingBottom: "20px" }}>
        <img src={snapcopyLogo} alt="SnapCopy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      </div>

      {/* --- Mode Buttons --- */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", width: "100%", maxWidth: 500 }}>
        <button onClick={() => handleModeSwitch("about")} style={{ flex: 1, padding: "12px", background: mode === "about" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>About Us</button>
        <button onClick={() => handleModeSwitch("responder")} style={{ flex: 1, padding: "12px", background: mode === "responder" ? colors.purple : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Responder</button>
        <button onClick={() => handleModeSwitch("sentiment")} style={{ flex: 1, padding: "12px", background: mode === "sentiment" ? colors.darkSlate : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Sentiment</button>
      </div>

      {/* --- Main Card --- */}
      <div style={{ width: "100%", maxWidth: 500, background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", margin: 0, fontWeight: "800", background: `linear-gradient(to right, ${colors.deepBlue}, ${colors.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : "Sentiment Snap"}
          </h1>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: colors.deepBlue, textTransform: "uppercase", letterSpacing: "2px", marginTop: "4px" }}>
            {mode === "sentiment" ? "AI Feedback Analysis" : "AI Powered Content"}
          </p>
          <p style={{ fontSize: "14px", color: "#718096", lineHeight: "1.5", margin: "10px auto 0", maxWidth: "90%" }}>
            {descriptions[mode]}
          </p>
        </div>

        {/* --- FORMS --- */}
        {mode === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="HVAC, Roofing..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="City" value={city} onChange={setCity} placeholder="Richmond, VA" colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Years of Experience" value={years} onChange={setYears} placeholder="10" type="number" colors={colors} getInputStyle={getInputStyle} />
          </div>
        )}

        {mode === "responder" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputField label="Original Post" value={originalPost} onChange={setOriginalPost} placeholder="Paste original post..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Comment" value={comment} onChange={setComment} placeholder="Comment to reply to..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Tone" value={tone} onChange={setTone} placeholder="Friendly, professional..." colors={colors} getInputStyle={getInputStyle} />
          </div>
        )}

        {mode === "sentiment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Paste Content / Comments</label>
            <textarea
              value={rawComments}
              onChange={(e) => setRawComments(e.target.value)}
              placeholder="Paste everything here..."
              style={{ ...inputStyle, height: "150px", resize: "none" }}
            />
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: "100%", padding: "15px", background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})`,
            color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer", marginTop: "20px"
          }}
        >
          {loading ? "Analyzing..." : "Run Snap"}
        </button>

        {error && <div style={{ color: colors.errorRed, marginTop: "15px", textAlign: "center", fontSize: "14px", fontWeight: "600", backgroundColor: "#fff5f5", padding: "10px", borderRadius: "8px" }}>{error}</div>}

        {output && (
          <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ fontSize: "14px", color: colors.deepBlue, margin: 0 }}>Result:</h3>
              <button onClick={copyToClipboard} style={{ padding: "6px 12px", background: copied ? colors.successGreen : colors.deepBlue, color: "white", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output} readOnly
              style={{ width: "100%", height: "180px", padding: "15px", borderRadius: "12px", border: `1px solid ${colors.lightGray}`, backgroundColor: "#f8fafc", fontSize: "14px", lineHeight: "1.6", color: colors.textDark, resize: "none", boxSizing: "border-box" }}
            />
          </div>
        )}
      </div>

      {/* --- BUSINESS TOOLS BUTTON --- */}
      <button
        onClick={() => navigate("/onboarding")} 
        style={{
          width: "100%", maxWidth: 500, padding: "14px", background: colors.orange, color: "white",
          border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
          marginTop: "25px", boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)", transition: "0.2s"
        }}
        onMouseOver={(e) => e.target.style.background = colors.orangeHover}
        onMouseOut={(e) => e.target.style.background = colors.orange}
      >
        Access Business Tools & Strategy →
      </button>

    </div>
  );
}

/**
 * 3. ROUTER COMPONENT
 * This wraps your app to enable multiple pages.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SnapCopyTool />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={getInputStyle(focused)}
      />
    </div>
  );
}