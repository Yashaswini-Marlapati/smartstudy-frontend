import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthHeader } from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("STUDENT");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  
const handleLogin = async () => {
  try {
    setAuthHeader(email, password);

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify({
      email: email,
      role: role
    }));

    if (role === "STUDENT") {
      await API.get("/rooms/student/all");
      navigate("/student");
    } else {
      await API.get("/rooms/admin/all");
      navigate("/admin");
    }

  } catch (err) {
    alert("Invalid Credentials or Role Mismatch");
  }
};


  return (
  <div
    style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      fontFamily: "Arial",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        width: "380px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "25px" }}>
        Smart Study Room System
      </h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

<div style={{ position: "relative", marginBottom: "20px" }}>

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    }}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "14px",
      color: "#555"
    }}
  >
    {showPassword ? "🙈" : "👁"}
  </span>

</div>

      <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  }}
>
  <option value="STUDENT">Student</option>
  <option value="ADMIN">Admin</option>
</select>

      

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#2a5298",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <p style={{ marginTop: "15px" }}>
      Don't have an account?{" "}
      <span
      style={{ color: "blue", cursor: "pointer" }}
      onClick={() => navigate("/register")}
      >
       Register
      </span>
      </p>
    </div>
  </div>
);
}

export default Login;