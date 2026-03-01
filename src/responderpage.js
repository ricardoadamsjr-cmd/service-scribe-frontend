import { useState } from "react";

export default function ResponderPage() {
  const [originalPost, setOriginalPost] = useState("");
  const [comment, setComment] = useState("");
  const [tone, setTone] = useState("");
  const [sentences, setSentences] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = {
    logobackground: "#592e72",
    deepBlue: "#860aa5",
    purple: "#390b64",
    lightGray: "#e2e8f0",
    textDark: "#1a202c",
    errorRed: "#e53e3e"
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

  async function generate() {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("https://ai.snapcopy.online/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPost,
          comment,
          tone,
          sentences,
          mode: "responder"
        })
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setOutput(data.reply);
    } catch (err) {
      setError("Could not reach the AI backend. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      background: "#f0f2f5",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>

      {/* --- Logo Placeholder --- */}
      <div style={{
        width: 300,
        height: 300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: "5px",
        color: "white",
        fontWeight: "700",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px",
      }}>
        <img src="/snapcopyLogo.png" alt="SnapCopy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
      </div>

      {/* --- Mode Buttons --- */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px"
      }}>
        <button
          style={{
            flex: 1,
            padding: "12px",
            background: colors.deepBlue,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }}
        >
          About Us
        </button>

        <button
          style={{
            flex: 1,
            padding: "12px",
            background: colors.purple,
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
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
            Responder
          </h1>
          <p style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: colors.deepBlue,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginTop: "5px"
          }}>
            AI Powered Replies
          </p>
        </div>

        {/* --- Responder Form --- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <InputField
            label="Original Post"
            value={originalPost}
            onChange={setOriginalPost}
            placeholder="Paste the original post here..."
            colors={colors}
            getInputStyle={getInputStyle}
          />

          <InputField
            label="Comment"
            value={comment}
            onChange={setComment}
            placeholder="Paste the comment you want to reply to..."
            colors={colors}
            getInputStyle={getInputStyle}
          />

          <InputField
            label="Tone"
            value={tone}
            onChange={setTone}
            placeholder="Friendly, professional, bold..."
            colors={colors}
            getInputStyle={getInputStyle}
          />

          <InputField
            label="Number of Sentences"
            value={sentences}
            onChange={setSentences}
            placeholder="2"
            type="number"
            colors={colors}
            getInputStyle={getInputStyle}
          />

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
              marginTop: "10px",
              boxShadow: "0 4px 15px rgba(94, 79, 162, 0.3)",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Generating Reply..." : "Generate Reply"}
          </button>
        </div>

        {error && (
          <div style={{
            color: colors.errorRed,
            marginTop: "15px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            {error}
          </div>
        )}

        {output && (
          <div style={{
            marginTop: "30px",
            borderTop: `1px solid ${colors.lightGray}`,
            paddingTop: "20px"
          }}>
            <h3 style={{ fontSize: "14px", color: colors.deepBlue, marginBottom: "10px" }}>
              AI Reply:
            </h3>
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
