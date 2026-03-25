import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function StudentDashboard() {

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // ===============================
  // FETCH ROOMS
  // ===============================
  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms/student/all");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // FETCH MY BOOKINGS
  // ===============================
  const fetchBookings = async () => {
    try {
      const res = await API.get("/booking/student/my-bookings");
      const sorted = res.data.sort(
      (a, b) => new Date(b.startTime) - new Date(a.startTime)
    );

    setBookings(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // FETCH ANALYTICS
  // ===============================
  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics/student");
      setAnalytics(res.data);
    } catch (err) {
      console.log("Analytics not available yet");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    fetchAnalytics();
  }, []);

  // ===============================
  // ROOM COLOR LOGIC
  // ===============================
  const getRoomColor = (room) => {
    if (room.currentOccupancy === 0) return "#4CAF50";
    if (room.currentOccupancy >= room.capacity) return "#F44336";
    return "#FFC107";
  };

  const getStatusText = (room) => {
    if (room.currentOccupancy === 0) return "Available";
    if (room.currentOccupancy >= room.capacity) return "Full";
    return "Partially Occupied";
  };

  // ===============================
  // BOOK ROOM
  // ===============================
  const handleBook = async (roomId) => {
    try {
const now = new Date();
const endDate = new Date(now.getTime() + 60 * 60 * 1000);

const start = now.getFullYear() + "-" +
  String(now.getMonth()+1).padStart(2,'0') + "-" +
  String(now.getDate()).padStart(2,'0') + "T" +
  String(now.getHours()).padStart(2,'0') + ":" +
  String(now.getMinutes()).padStart(2,'0') + ":" +
  String(now.getSeconds()).padStart(2,'0');

const end = endDate.getFullYear() + "-" +
  String(endDate.getMonth()+1).padStart(2,'0') + "-" +
  String(endDate.getDate()).padStart(2,'0') + "T" +
  String(endDate.getHours()).padStart(2,'0') + ":" +
  String(endDate.getMinutes()).padStart(2,'0') + ":" +
  String(endDate.getSeconds()).padStart(2,'0');
      await API.post(
        `/booking/student/book?roomId=${roomId}&start=${start}&end=${end}`
      );

      alert("Room Booked Successfully!");
      fetchRooms();
      fetchBookings();

    } catch (err) {
      alert("Added to Waitlist or Booking Failed");
    }
  };

  // ===============================
  // CHECK IN
  // ===============================
  const handleCheckIn = async (bookingId) => {
    try {
      await API.post(`/booking/student/checkin?bookingId=${bookingId}`);
      fetchRooms();
      fetchBookings();
    } catch {
      alert("Check-In Failed");
    }
  };

  // ===============================
  // CHECK OUT
  // ===============================
  const handleCheckOut = async (bookingId) => {
    try {
      await API.post(`/booking/student/checkout?bookingId=${bookingId}`);
      fetchRooms();
      fetchBookings();
    } catch {
      alert("Check-Out Failed");
    }
  };

  // ===============================
  // UPCOMING BOOKING REMINDER
  // ===============================
  const upcomingBooking = bookings.find(b => {
    if (!b.startTime) return false;

    const now = new Date();
    const start = new Date(b.startTime);
    const diff = (start - now) / (1000 * 60);

    return diff > 0 && diff <= 30 && b.status === "CONFIRMED";
  });


  useEffect(() => {
  fetchRooms();
  fetchBookings();

  const interval = setInterval(() => {
    fetchRooms();
    fetchBookings();
  }, 5000); // refresh every 5 seconds

  return () => clearInterval(interval);

}, []);

  // ===============================
  // PAGINATION LOGIC
  // ===============================
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <>
      <Navbar role="Student" />

      <div style={{ padding: "40px", background: "#f4f6f9", minHeight: "100vh" }}>

        {/* Reminder Banner */}
        {upcomingBooking && (
          <div style={{
            background: "#ff9800",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontWeight: "bold"
          }}>
            🔔 Reminder: Your booking for {upcomingBooking.room.name} starts soon!
          </div>
        )}

        <h2 style={{ marginBottom: "30px" }}>Available Study Rooms</h2>

        {/* ROOM GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px"
        }}>
          {rooms.map(room => (
            <div
              key={room.id}
              style={{
                backgroundColor: getRoomColor(room),
                padding: "20px",
                borderRadius: "15px",
                color: "white",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}
            >
              <h3>{room.name}</h3>
              <p>Capacity: {room.capacity}</p>
              <p>Occupancy: {room.currentOccupancy}</p>
              <p>Status: {getStatusText(room)}</p>

              <button
                onClick={() => handleBook(room.id)}
                disabled={room.currentOccupancy >= room.capacity}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: room.currentOccupancy >= room.capacity ? "#999" : "#1e1e2f",
                  color: "white",
                  cursor: room.currentOccupancy >= room.capacity ? "not-allowed" : "pointer"
                }}
              >
                {room.currentOccupancy >= room.capacity ? "Full" : "Book Room"}
              </button>
            </div>
          ))}
        </div>

        {/* =============================== */}
        {/* MY BOOKINGS */}
        {/* =============================== */}

        <div style={{ marginTop: "60px" }}>
          <h2>My Bookings</h2>

          {bookings.length === 0 && <p>No bookings yet.</p>}

          {currentBookings.map(b => (
            <div key={b.id} style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}>
              <p><strong>Room:</strong> {b.room.name}</p>

              <p>
                <strong>Status:</strong>
                <span style={{
                  marginLeft: "8px",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  backgroundColor:
                    b.status === "CONFIRMED" ? "#4CAF50" :
                    b.status === "WAITING" ? "#FFC107" :
                    b.status === "COMPLETED" ? "#2196F3" :
                    "#F44336",
                  color: "white",
                  fontSize: "12px"
                }}>
                  {b.status}
                </span>
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                {b.status === "CONFIRMED" && !b.checkInTime && (
                  <button
                    onClick={() => handleCheckIn(b.id)}
                    style={{
                      background: "#1e88e5",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    Check In
                  </button>
                )}

                {b.checkInTime && !b.checkOutTime && (
                  <button
                    onClick={() => handleCheckOut(b.id)}
                    style={{
                      background: "#e53935",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    Check Out
                  </button>
                )}

              </div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: "5px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: currentPage === i + 1 ? "#2a5298" : "#ccc",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}

export default StudentDashboard;