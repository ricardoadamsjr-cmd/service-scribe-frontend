import { useState } from "react";
import snapcopyLogo from "./assets/snapcopyLogo.png";
// --- NEW: Imported AirStadt Business Logo ---
import airStadtLogo from "./assets/AirStadt_logo orange.png";

export default function App() {
  // --- MODE SWITCH ---
  const [mode, setMode] = useState("about");

  // --- ABOUT US FORM STATE ---
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");

  // --- RESPONDER FORM STATE ---
  const [originalPost, setOriginalPost] = useState("");
  const [comment, setComment] = useState("");
  const [tone, setTone] = useState("");

  // --- SENTIMENT FORM STATE ---
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
    footerText: "#718096" // Added a soft grey for the footer text
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

  // --- HANDLE MODE SWITCH ---
  const handleModeSwitch = (newMode) => {
    setIndustry("");
    setCity("");
    setYears("");
    setOriginalPost("");
    setComment("");
    setTone("");
    setRawComments("");
    setOutput("");
    setError("");
    setCopied(false);
    setMode(newMode);
  };

  // --- COPY TO CLIPBOARD ---
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

  // --- MAIN GENERATE FUNCTION ---
  async function generate() {
    setOutput("");
    setError("");
    setCopied(false);
    
    if (mode === "about") {
      if (!industry.trim() || !city.trim() || !years.trim()) {
        setError("Please fill out all About Us fields");
        return;
      }
    } else if (mode === "responder") {
      if (!originalPost.trim() || !comment.trim() || !tone.trim()) {
        setError("Please fill out all Responder fields");
        return;
      }
    } else if (mode === "sentiment") {
      if (!rawComments.trim()) {
        setError("Please paste the page content or comments");
        return;
      }
    }
    
    setLoading(true);

    let payload = { mode };
    if (mode === "about") {
      payload = { ...payload, industry, city, years };
    } else if (mode === "responder") {
      payload = { ...payload, originalPost, comment, tone };
    } else {
      payload = { ...payload, rawComments };
    }

    try {
      const response = await fetch("https://api.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Server error: ${response.status}`);

      const result = mode === "about" ? data.about : (mode === "responder" ? data.reply : data.sentiment);
      if (!result) throw new Error("No response received from AI");
      setOutput(result);

    } catch (err) {
      setError(err.message || "Could not reach the AI backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh", // Ensures the container fills the screen
      width: "100vw",
      background: "#f0f2f5",
      padding: "20px",
      paddingTop: "10px",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      {/* --- App Logo Section --- */}
      <div style={{
        width: 250,
        height: 250,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        paddingBottom: "20px",
      }}>
        <img 
          src={snapcopyLogo} 
          alt="SnapCopy Logo" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%"
          }}
        />
      </div>

      {/* --- Mode Buttons --- */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "25px",
        width: "100%",
        maxWidth: 500
      }}>
        <button onClick={() => handleModeSwitch("about")} style={{ flex: 1, padding: "12px", background: mode === "about" ? colors.deepBlue : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>About Us</button>
        <button onClick={() => handleModeSwitch("responder")} style={{ flex: 1, padding: "12px", background: mode === "responder" ? colors.purple : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>Responder</button>
        <button onClick={() => handleModeSwitch("sentiment")} style={{ flex: 1, padding: "12px", background: mode === "sentiment" ? colors.darkSlate : "#bda4c9", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>Sentiment</button>
      </div>

      {/* --- Main Card --- */}
      <div style={{
        width: "100%",
        maxWidth: 500,
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        marginBottom: "40px" // Space before footer
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "36px",
            margin: 0,
            fontWeight: "800",
            background: `linear-gradient(to right, ${colors.deepBlue}, ${colors.purple})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-1px"
          }}>
            {mode === "about" ? "About Us Snap" : mode === "responder" ? "Responder Snap" : "Sentiment Snap"}
          </h1>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: colors.deepBlue, textTransform: "uppercase", letterSpacing: "2px", marginTop: "0px" }}>
            {mode === "sentiment" ? "AI Feedback Analysis" : "AI Powered Content"}
          </p>
        </div>
            {/* INSTRUCTION BLOCK HERE: */}
        {mode === "about" && (
          <div style={{
            backgroundColor: "#f0f4fa",
            padding: "15px",
            borderRadius: "10px",
            border: `1px solid ${colors.deepBlue}22`,
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "14px", color: colors.textDark, lineHeight: "1.5", margin: 0, fontWeight: "500" }}>
              Fill out the fields and get a custom snippet about your company or your experience for emails, websites, or social media posts.
            </p>
          </div>
        )}

        {mode === "responder" && (
          <div style={{
            backgroundColor: "#f0f4fa", // Light blue tint
            padding: "15px",
            borderRadius: "10px",
            border: `1px solid ${colors.purple}22`,
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "14px", color: colors.textDark, lineHeight: "1.5", margin: 0, fontWeight: "500" }}>
              To reply to a <strong>specific comment</strong>, paste the original post and that comment. To reply <strong>directly to the post</strong>, leave the second field blank.
            </p>
          </div>
        )}

        {mode === "sentiment" && (
          <div style={{
            backgroundColor: "#f0f4fa", // Light blue tint
            padding: "15px",
            borderRadius: "10px",
            border: `1px solid ${colors.darkSlate}22`,
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "14px", color: colors.textDark, lineHeight: "1.5", margin: 0, fontWeight: "500" }}>
              Drag and copy all the comments from a post and paste them here. The AI will automatically sort out the noise and analyze the feedback for you.
            </p>
          </div>
        )}
          {/*END INSTRUCTION BLOCK HERE: */}

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
              placeholder="Paste everything here. AI will filter the noise and find the comments..."
              style={{ ...inputStyle, height: "150px", resize: "none" }}
            />
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.purple})`,
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "20px",
            boxShadow: "0 4px 15px rgba(94, 79, 162, 0.3)",
            opacity: loading ? 0.7 : 1
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
              value={output}
              readOnly
              style={{ width: "100%", height: "180px", padding: "15px", borderRadius: "12px", border: `1px solid ${colors.lightGray}`, backgroundColor: "#f8fafc", fontSize: "14px", lineHeight: "1.6", color: colors.textDark, resize: "none", boxSizing: "border-box" }}
            />
          </div>
        )}
      </div>

      {/* --- NEW: FOOTER SECTION --- */}
      <footer style={{
        marginTop: "auto", // Pushes footer to bottom of flex container
        width: "100%",
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px 0",
        borderTop: `1px solid ${colors.lightGray}88`
      }}>
        <img 
          src={airStadtLogo} 
          alt="AirStadt Business Logo" 
          style={{ height: "30px", width: "auto" }} 
        />
        <p style={{ 
          fontSize: "13px", 
          color: colors.footerText, 
          margin: 0,
          fontWeight: "500"
        }}>
          &copy; {new Date().getFullYear()} AirStadt. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={getInputStyle(focused)}
      />
    </div>
  );
}