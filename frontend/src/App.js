import { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    workHours: "",
    deadlines: "5",
    sleepHours: "",
    productivity: "50",
    workType: "",
  });

  const [stressLevel, setStressLevel] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const features = [
      Number(formData.workHours),
      Number(formData.deadlines),
      Number(formData.sleepHours),
      Number(formData.productivity),
      Number(formData.workType),
    ];

    try {
      const res = await fetch("https://stress-level-detection.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: features }),
      });

      const data = await res.json();
      setStressLevel(data.predicted_stress_level);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get prediction. Make sure the Flask server is running!");
    }
  };

  const getStressMessage = (level) => {
    if (level >= 9.5) return "Take a long vacation ASAP, bro!";
    if (level >= 9) return "You desperately need a holiday!";
    if (level >= 8) return "Bunk a few days and recharge!";
    if (level >= 7) return "High stress alert! Time to slow down.";
    if (level >= 6) return "Stress is building up. Take breaks!";
    if (level >= 5) return "Moderate stress. Stay mindful.";
    if (level >= 4) return "Slight stress. You're doing okay!";
    if (level >= 3) return "Low stress. Keep it up!";
    if (level >= 2) return "Very relaxed! Great balance!";
    return "🌟 Zen mode activated! Perfect harmony!";
  };

  const getStressColor = (level) => {
    if (level >= 9) return { bg: "linear-gradient(135deg, #fecaca 0%, #dc2626 100%)", color: "white" };
    if (level >= 7) return { bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#991b1b" };
    if (level >= 4) return { bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", color: "#92400e" };
    return { bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", color: "#065f46" };
  };

  const isFormValid = formData.workHours && formData.sleepHours && formData.workType;

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "40px", maxWidth: "600px", width: "100%", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)" }}>
        <h1 style={{ textAlign: "center", color: "#667eea", marginBottom: "30px", fontSize: "2.5rem" }}>🧠 Stress Level Predictor</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>Working Hours per Day</label>
            <input
              type="number"
              name="workHours"
              placeholder="e.g., 8"
              min="0"
              max="24"
              step="0.5"
              value={formData.workHours}
              onChange={handleChange}
              style={{ padding: "12px 15px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "16px", outline: "none", transition: "all 0.3s ease" }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>Deadlines per Week (1-10)</label>
            <input
              type="range"
              name="deadlines"
              min="1"
              max="10"
              value={formData.deadlines}
              onChange={handleChange}
              style={{ 
                WebkitAppearance: "none",
                appearance: "none",
                width: "100%",
                height: "8px", 
                background: "linear-gradient(to right, #4ade80 0%, #fbbf24 50%, #ef4444 100%)", 
                borderRadius: "10px", 
                cursor: "pointer",
                outline: "none"
              }}
            />
            <div style={{ textAlign: "center", fontWeight: "600", color: "#667eea", fontSize: "1.1rem" }}>{formData.deadlines}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>Sleeping Hours per Day</label>
            <input
              type="number"
              name="sleepHours"
              placeholder="e.g., 7"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleepHours}
              onChange={handleChange}
              style={{ padding: "12px 15px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "16px", outline: "none", transition: "all 0.3s ease" }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>Productivity Metric (10-100%)</label>
            <input
              type="range"
              name="productivity"
              min="10"
              max="100"
              value={formData.productivity}
              onChange={handleChange}
              style={{ 
                WebkitAppearance: "none",
                appearance: "none",
                width: "100%",
                height: "8px", 
                background: "linear-gradient(to right, #ef4444 0%, #fbbf24 50%, #4ade80 100%)", 
                borderRadius: "10px", 
                cursor: "pointer",
                outline: "none"
              }}
            />
            <div style={{ textAlign: "center", fontWeight: "600", color: "#667eea", fontSize: "1.1rem" }}>{formData.productivity}%</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "600", color: "#333", fontSize: "0.95rem" }}>Work Type</label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              style={{ padding: "12px 15px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "16px", cursor: "pointer", backgroundColor: "white", outline: "none", transition: "all 0.3s ease" }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            >
              <option value="">Select work type...</option>
              <option value="0">🏠 Remote</option>
              <option value="1">🔀 Hybrid</option>
              <option value="2">🏢 Onsite</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={{ 
              background: isFormValid ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#ccc", 
              color: "white", 
              padding: "15px", 
              border: "none", 
              borderRadius: "10px", 
              fontSize: "18px", 
              fontWeight: "600", 
              cursor: isFormValid ? "pointer" : "not-allowed", 
              marginTop: "10px",
              transition: "all 0.2s ease",
              opacity: isFormValid ? 1 : 0.6
            }}
            onMouseEnter={(e) => isFormValid && (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            Predict Stress Level
          </button>
        </div>

        {stressLevel !== null && (
          <div style={{ marginTop: "40px", padding: "30px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", borderRadius: "15px", textAlign: "center" }}>
            <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "1.8rem" }}>Stress Level: {stressLevel.toFixed(1)}/10</h2>

            <div style={{ position: "relative", margin: "30px 0" }}>
              <div style={{ width: "100%", height: "40px", background: "linear-gradient(to right, #4ade80 0%, #a3e635 20%, #facc15 40%, #fb923c 60%, #f87171 80%, #dc2626 100%)", borderRadius: "20px", position: "relative", overflow: "visible", boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.2)" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "-30px",
                    left: `${Math.min(stressLevel * 10, 100)}%`,
                    width: "4px",
                    height: "30px",
                    background: "#1f2937",
                    transform: "translateX(-50%)",
                    transition: "left 0.5s ease"
                  }}
                >
                  <div style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", width: "0", height: "0", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #1f2937" }}></div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.85rem", color: "#666", fontWeight: "600" }}>
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontWeight: "600",
                background: getStressColor(stressLevel).bg,
                color: getStressColor(stressLevel).color
              }}
            >
              {getStressMessage(stressLevel)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}