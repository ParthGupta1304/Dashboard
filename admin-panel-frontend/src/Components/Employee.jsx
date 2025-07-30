import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const Employee = () => {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [error, setError] = useState(""); // <-- Add error state
  const { ID } = useParams();

  useEffect(() => {
    if (!ID) {
      setError("No employee ID found.");
      return;
    }
    axios
      .get(`${API_ENDPOINTS.EMPLOYEE}/${ID}`)
      .then((res) => {
        // Check if response is valid object
        if (typeof res.data !== "object" || res.data === null || Array.isArray(res.data)) {
          setError("Invalid employee data received.");
          return;
        }
        setUser(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Error fetching employee data.");
        console.error("Error fetching employee:", err);
      });
  }, [ID]);
  const check_status = () => {
    if (Array.isArray(user.leave_history) && user.leave_history.length > 0) {
      const lastStatus =
        user.leave_history[user.leave_history.length - 1].Status;
      if (lastStatus === "Accepted") return "Accepted";
      if (lastStatus === "Rejected") return "Ask Again";
      return "Pending";
    }
    return "Request Leave";
  };

  const handleAskLeave = async () => {
    try {
      await axios.patch(`${API_ENDPOINTS.EMPLOYEE}/${ID}/ask-leave`, {
        asked_leave_reason: leaveReason,
        leave_start: leaveStart,
        leave_end: leaveEnd,
        admin_approval: true, // Assuming admin approval is required
      });
      alert("Leave requested!");
      setShowModal(false);
      setUser({
        ...user,
        asked_leave_status: true,
        asked_leave_reason: leaveReason,
      });
    } catch (err) {
      alert("Error requesting leave");
    }
  };

  // Helper to check if leave is active (granted and end date not passed)
  const isLeaveActive = () => {
    if (user.leaves_granted > 0 && user.leave_end) {
      const today = new Date();
      const endDate = new Date(user.leave_end);
      if (today <= endDate) {
        return true;
      }
    }
    user.asked_leave_status === false;
    user.asked_leave_reason = "";
    user.leave_start = "";
    user.leave_end = "";
    return false;
  };

  // Reset leave status if leave end date has passed
  useEffect(() => {
    if (user.leaves_granted > 0 && user.leave_end) {
      const today = new Date();
      const endDate = new Date(user.leave_end);
      if (today > endDate && user.asked_leave_status === false) {
        setUser((prev) => ({
          ...prev,
          leaves_granted: 0,
          asked_leave_status: false,
          asked_leave_reason: "",
          leave_start: "",
          leave_end: "",
        }));
      }
    }
  }, [user.leaves_granted, user.leave_end, user.asked_leave_status]);

  // Render the employee dashboard UI
  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-950 to-gray-950 text-white">
        <h1 className="text-4xl font-bold mb-4">Employee Dashboard</h1>
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-950 via-zinc-950 to-gray-950 text-white">
      <h1 className="text-white text-6xl font-bold mb-1 ml-7 mr-7 mt-8 border-b-2 font-[FoundersGrotesk] z-50">
        Employee Dashboard
      </h1>
      <h2 className="text-4xl font-semibold text-center mt-20">
        Welcome {user.username} !
      </h2>
      <div className="flex flex-col items-center mt-8">
        <button
          disabled={
            check_status() === "Pending" || check_status() === "Accepted"
          }
          onClick={() => setShowModal(true)}
          className={`mb-6 px-6 py-2 rounded font-bold transition ${
            check_status() === "Pending" || check_status() === "Accepted"
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-800"
          }`}
        >
          {check_status()}
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Request Leave
              </h3>
              <label className="block text-white mb-2">Reason for Leave:</label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
                placeholder="Enter reason"
              />
              <label className="block text-white mb-2">Start Date:</label>
              <input
                type="date"
                value={leaveStart}
                onChange={(e) => setLeaveStart(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <label className="block text-white mb-2">End Date:</label>
              <input
                type="date"
                value={leaveEnd}
                onChange={(e) => setLeaveEnd(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAskLeave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <table className="mt-10 mx-auto bg-zinc-800 shadow-lg rounded-lg w-full max-w-2xl">
        <tbody>
          <tr>
            <td className="px-6 py-3 text-left text-medium font-medium text-white uppercase tracking-wider">
              Name
            </td>
            <td className="py-2">{user.username || user.name || ""}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-left text-medium font-medium text-white uppercase tracking-wider">
              ID
            </td>
            <td className="py-2">{user.ID}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-left text-medium font-medium text-white uppercase tracking-wider">
              Leave Status
            </td>
            <td className="py-2">
              {user.asked_leave_status &&
              isLeaveActive() &&
              !user.admin_approval
                ? "Granted"
                : isLeaveActive() && user.admin_approval
                ? "Pending"
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-left text-medium font-medium text-white uppercase tracking-wider">
              Leave Reason
            </td>
            <td className="py-2">{user.asked_leave_reason || "-"}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-left text-medium font-medium text-white uppercase tracking-wider">
              Leave Dates
            </td>
            <td className="py-2">
              {user.leave_start && user.leave_end
                ? `${user.leave_start} to ${user.leave_end}`
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Employee;
