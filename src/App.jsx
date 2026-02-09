import { useState } from "react";

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

  // --- SHARED STATE ---
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const colors = {
    logobackground: "#592e72",
    deepBlue: "#860aa5",
    purple: "#390b64",
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e",
    successGreen: "#38a169"
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
    // Clear all form fields
    setIndustry("");
    setCity("");
    setYears("");
    setOriginalPost("");
    setComment("");
    setTone("");
    setOutput("");
    setError("");
    setCopied(false);
    
    // Switch mode
    setMode(newMode);
  };

  // --- COPY TO CLIPBOARD ---
  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      
      // Reset copied status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard");
    }
  };

  // --- MAIN GENERATE FUNCTION ---
  async function generate() {
    // Clear previous results
    setOutput("");
    setError("");
    setCopied(false);
    
    // Simple validation
    if (mode === "about") {
      if (!industry.trim() || !city.trim() || !years.trim()) {
        setError("Please fill out all About Us fields");
        return;
      }
    } else {
      if (!originalPost.trim() || !comment.trim() || !tone.trim()) {
        setError("Please fill out all Responder fields");
        return;
      }
    }
    
    setLoading(true);

    let payload = {};

    if (mode === "about") {
      payload = { 
        mode: "about", 
        industry: industry.trim(), 
        city: city.trim(), 
        years: years.trim() 
      };
    } else {
      payload = {
        mode: "responder",
        originalPost: originalPost.trim(),
        comment: comment.trim(),
        tone: tone.trim()
      };
    }

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Get the result based on mode
      const result = mode === "about" ? data.about : data.reply;
      
      if (!result) {
        throw new Error("No response received from AI");
      }
      
      setOutput(result);

    } catch (err) {
      setError(err.message || "Could not reach the AI backend. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  background: "#f0f2f5",
  padding: "20px",
  paddingTop: "10px",            // ← Less top padding
  boxSizing: "border-box",
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
}}>

      {/* --- Logo Placeholder --- */}
      <div style={{
        width: 250,                    // ← Made logo smaller
        height: 250,
        marginBottom: "10px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "hidden",
        color: "white",
        fontWeight: "700",
        fontSize: "14px",
        textAlign: "center",
        paddingBottom: "20px",
        paddingLeft: "30px",
        paddingRight: "30px",
      }}>
        <img src="images/snapcopyLogo.png" alt="SnapCopy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      </div>

      {/* --- Mode Buttons --- */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px"
      }}>
        <button
          onClick={() => handleModeSwitch("about")}
          style={{
            flex: 1,
            padding: "12px",
            background: mode === "about" ? colors.deepBlue : "#bda4c9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            transition: "background 0.2s"
          }}
        >
          About Us
        </button>

        <button
          onClick={() => handleModeSwitch("responder")}
          style={{
            flex: 1,
            padding: "12px",
            background: mode === "responder" ? colors.purple : "#bda4c9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            transition: "background 0.2s"
          }}
        >
         Responder
        </button>
      </div>

      {/* --- Main Card --- */}
      <div style={{
        width: "100%",
        maxWidth: 500,
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      }}>

        {/* --- Title --- */}
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
            {mode === "about" ? "About Us Snap" : "Comment Responder snap"}
          </h1>

          <p style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: colors.deepBlue,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginTop: "0px"
          }}>
            {mode === "about" ? "AI Powered Content" : "AI Powered Replies"}
          </p>
        </div>

        {/* --- ABOUT FORM --- */}
        {mode === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="HVAC, Roofing, Landscaping..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="City" value={city} onChange={setCity} placeholder="Richmond, VA" colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Years of Experience" value={years} onChange={setYears} placeholder="10" type="number" colors={colors} getInputStyle={getInputStyle} />
          </div>
        )}

        {/* --- RESPONDER FORM --- */}
        {mode === "responder" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InputField label="Original Post" value={originalPost} onChange={setOriginalPost} placeholder="Paste the original post..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Comment" value={comment} onChange={setComment} placeholder="Paste the comment to reply to..." colors={colors} getInputStyle={getInputStyle} />
            <InputField label="Tone" value={tone} onChange={setTone} placeholder="Friendly, bold, professional..." colors={colors} getInputStyle={getInputStyle} />
          </div>
        )}

        {/* --- SUBMIT BUTTON --- */}
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
            transition: "transform 0.2s, opacity 0.2s",
            marginTop: "20px",
            boxShadow: "0 4px 15px rgba(94, 79, 162, 0.3)",
            opacity: loading ? 0.7 : 1
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {loading ? "Generating..." : mode === "about" ? "Generate Content" : "Generate Reply"}
        </button>

        {/* --- ERROR --- */}
        {error && (
          <div style={{
            color: colors.errorRed,
            marginTop: "15px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: "#fff5f5",
            padding: "10px",
            borderRadius: "8px",
            border: `1px solid ${colors.errorRed}33`
          }}>
            {error}
          </div>
        )}

        {/* --- OUTPUT --- */}
        {output && (
          <div style={{
            marginTop: "30px",
            borderTop: `1px solid ${colors.lightGray}`,
            paddingTop: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}>
              <h3 style={{ fontSize: "14px", color: colors.deepBlue, margin: 0 }}>
                {mode === "about" ? "Results:" : "AI Reply:"}
              </h3>
              
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "6px 12px",
                  background: copied ? colors.successGreen : colors.deepBlue,
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background 0.2s"
                }}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2"/>
                      <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="white" strokeWidth="2"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <textarea
              value={output}
              readOnly
              style={{
                width: "100%",
                height: "180px",
                padding: "15px",
                borderRadius: "12px",
                border: `1px solid ${colors.lightGray}`,
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                lineHeight: "1.6",
                color: colors.textDark,
                resize: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", colors, getInputStyle }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
        {label}
      </label>
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