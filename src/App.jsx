import { useState } from "react";

export default function App() {
  // -----------------------------
  // FORM STATE (add more fields here)
  // -----------------------------
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [years, setYears] = useState("");

  // Output + UI state
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          city,
          years,
        })
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setOutput(data.about);
    } catch (err) {
      setError("Could not reach the AI backend. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* --- NEW OUTER WRAPPER FOR CENTERING & BACKGROUND --- */
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Professional subtle gradient
      margin: 0,
      padding: "20px",
      boxSizing: "border-box"
    }}>

      {/* Your original wrapper - Centering logic improved */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          boxSizing: "border-box", // Changed from content-box for better layout control
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            background: "white",
            padding: 10, // Reduced slightly to fit better in the parent
            borderRadius: 12,
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 20 }}>
            Service Scribe
          </h1>

          <label>Industry</label>
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="HVAC, Roofing, Landscaping..."
            style={{ width: "100%", padding: 10, marginTop: 5, marginBottom: 15, boxSizing: "border-box" }}
          />

          <label>City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Richmond, VA"
            style={{ width: "100%", padding: 10, marginTop: 5, marginBottom: 15, boxSizing: "border-box" }}
          />

          <label>Years of Experience</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            style={{ width: "100%", padding: 10, marginTop: 5, marginBottom: 15, boxSizing: "border-box" }}
          />

          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              marginTop: 10
            }}
          >
            {loading ? "Generating..." : "Generate About Me"}
          </button>

          {error && (
            <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>
              {error}
            </div>
          )}

          <textarea
            value={output}
            readOnly
            placeholder="Your About Me paragraph will appear here..."
            style={{
              width: "100%",
              height: 200,
              marginTop: 20,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>
    </div>
  );
}