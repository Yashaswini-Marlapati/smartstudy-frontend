import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function AdminDashboard() {

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  // ================= FETCH ROOMS =================
  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms/admin/all");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await API.get("/booking/admin/all");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD ROOM =================
  const handleAddRoom = async () => {
    if (!roomName || !capacity) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/rooms/admin/add", {
        name: roomName.trim(),
        capacity: Number(capacity),
        currentOccupancy: 0
      });

      setRoomName("");
      setCapacity("");
      fetchRooms();
      alert("Room Added Successfully");
    } catch (err) {
      alert("Failed to Add Room");
    }
  };

  // ================= DELETE ROOM BY NAME =================
  const handleDeleteRoom = async (name) => {
    if (!window.confirm(`Delete room ${name}?`)) return;

    try {
      await API.delete(
        `/rooms/admin/delete-by-name/${encodeURIComponent(name)}`
      );
      fetchRooms();
    } catch {
      alert("Failed to delete room");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const getRoomColor = (room) => {
    if (room.currentOccupancy === 0) return "#4CAF50";
    if (room.currentOccupancy >= room.capacity) return "#F44336";
    return "#FFC107";
  };

  const statStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  };

  useEffect(() => {
  fetchRooms();
  fetchBookings();

  const interval = setInterval(() => {
    fetchRooms();
    fetchBookings();
  }, 5000); // refresh every 5 seconds

  return () => clearInterval(interval);

}, []);

  // ================= PAGINATION =================
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <>
      <Navbar role="Admin" />

      <div style={{ padding: "40px", background: "#f4f6f9", minHeight: "100vh" }}>
        <h2>Admin Dashboard</h2>

        {/* ================= ADD ROOM ================= */}
        <h3 style={{ marginTop: "30px" }}>Add New Study Room</h3>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          display: "flex",
          gap: "10px"
        }}>
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px" }}
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px" }}
          />

          <button
            onClick={handleAddRoom}
            style={{
              padding: "10px 15px",
              borderRadius: "6px",
              border: "none",
              background: "#2a5298",
              color: "white"
            }}
          >
            Add Room
          </button>
        </div>

        {/* ================= ROOM GRID ================= */}
        <h3 style={{ marginTop: "30px" }}>All Study Rooms</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          marginTop: "20px"
        }}>
          {rooms.map(room => (
            <div
              key={room.id}
              style={{
                backgroundColor: getRoomColor(room),
                padding: "20px",
                borderRadius: "15px",
                color: "white",
                position: "relative",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}
            >
              <h3>{room.name}</h3>
              <p>Capacity: {room.capacity}</p>
              <p>Occupancy: {room.currentOccupancy}</p>

              {/* ✕ DELETE BUTTON */}
              <button
                onClick={() => handleDeleteRoom(room.name)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#e53935",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ================= STATISTICS ================= */}
        <h3 style={{ marginTop: "60px" }}>System Statistics</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}>
          <div style={statStyle}>
            <h4>Total Rooms</h4>
            <p>{rooms.length}</p>
          </div>

          <div style={statStyle}>
            <h4>Total Occupancy</h4>
            <p>{rooms.reduce((sum, r) => sum + r.currentOccupancy, 0)}</p>
          </div>

          <div style={statStyle}>
            <h4>Available Rooms</h4>
            <p>{rooms.filter(r => r.currentOccupancy === 0).length}</p>
          </div>
        </div>

        {/* ================= BOOKINGS TABLE ================= */}
        <h3 style={{ marginTop: "60px" }}>All Bookings</h3>

        <div style={{
          marginTop: "20px",
          background: "white",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#2a5298", color: "white" }}>
                <th style={{ padding: "10px" }}>Student</th>
                <th style={{ padding: "10px" }}>Room</th>
                <th style={{ padding: "10px" }}>Start</th>
                <th style={{ padding: "10px" }}>End</th>
                <th style={{ padding: "10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map(b => (
                <tr key={b.id} style={{ textAlign: "center" }}>
                  <td>{b.user.email}</td>
                  <td>{b.room.name}</td>
                  <td>{b.startTime}</td>
                  <td>{b.endTime}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

export default AdminDashboard;