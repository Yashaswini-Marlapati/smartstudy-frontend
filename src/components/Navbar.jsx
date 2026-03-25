import { useNavigate } from "react-router-dom";

function Navbar({ role }) {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{
      background: "#1e1e2f",
      color: "white",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      <h3>Smart Study Room System</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* User Info */}
        <div style={{
          background: "#2a2a40",
          padding: "8px 15px",
          borderRadius: "20px",
          fontSize: "14px"
        }}>
          👤 {user?.email} | {role}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "#f44336",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;