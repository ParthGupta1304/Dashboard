// Admin panel component for managing employees
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Admin = () => {
  // State for employee list and admin name
  const [employees, setEmployees] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leave_history, setLeave_history] = useState(null);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [historyStart, setHistoryStart] = useState("");
  const [historyEnd, setHistoryEnd] = useState("");
  const [historyResults, setHistoryResults] = useState([]);
  const { adminID } = useParams();
  console.log("Admin ID from params:", adminID);

  // Fetch all employees on mount
  useEffect(() => {
    axios
      .get(API_ENDPOINTS.ADMIN)
      .then((res) => {
        setEmployees(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  useEffect(() => {
    // Fetch admin name by ID
    if (!adminID) {
      console.warn("No ID found. Redirect or show error.");
      return;
    }
    axios
      .get(`${API_ENDPOINTS.ADMIN}/${adminID}`)
      .then((res) => {
        setAdminName(res.data.username);
        console.log("Admin data:", res.data);
      })
      .catch(() => setAdminName("Admin"));
  }, [adminID]);

  // Remove an employee by ID
  const handleRemove = (ID) => {
    axios
      .delete(`${API_ENDPOINTS.ADMIN}/${ID}`)
      .then(() => setEmployees(employees.filter((e) => e.ID !== ID)))
      .catch((err) => alert("Error removing employee"));
  };

  // Show popup with employees who have requested leave
  const handleGrantLeave = () => {
    const requests = employees.filter((e) => e.admin_approval);
    setLeaveRequests(requests);
    setShowLeavePopup(true);
  };

  // Show details popup for selected employee
  const handleEmployeeClick = (emp) => {
    setSelectedEmployee(emp);
  };

  // Accept or reject leave
  const handleLeaveAction = async (ID, action) => {
    try {
      await axios.patch(`${API_ENDPOINTS.ADMIN}/${ID}/grant-leave`, { action });
      alert(`Leave ${action}ed successfully!`);
      setShowLeavePopup(false);
      setSelectedEmployee(null);
      // Reset admin approval status

      // Refresh employees list
      const res = await axios.get(API_ENDPOINTS.ADMIN);
      setEmployees(res.data);
    } catch (err) {
      alert("Error updating leave status");
    }
  };

  // Calculate pending leave requests
  const pendingLeaves = employees.filter(
    (e) => e.admin_approval === true
  ).length;

  // Fetch leave history by date range
  const fetchLeaveHistory = async () => {
    if (!historyStart || !historyEnd) return;
    try {
      const res = await axios.post(API_ENDPOINTS.LEAVE_HISTORY_RANGE, {
        start: historyStart,
        end: historyEnd,
      });
      setHistoryResults(res.data.history);
      console.log("Leave history results:", res.data.history);
    } catch (err) {
      alert("Error fetching leave history");
      console.log("Error fetching leave history:", err);
    }
  };

  // Render the admin panel UI
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-slate-950 to-gray-950 ">
      <div className="flex justify-between gap-10 border-b-2 border-gray-700">
        <h1 className=" text-white text-6xl font-semibold mb-5 mr-5 mt-8  ml-8 bg-gradient-to-r from-slate-400 via-zinc-300 to-gray-100 bg-clip-text ">
          Welcome {adminName}
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleGrantLeave}
            className="relative border-2 border-white rounded-lg text-2xl mt-8 mb-5 mr-2 p-3 text-white font-semibold hover:bg-slate-700 bg-blue-700 transition"
          >
            Leaves
            {pendingLeaves > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold animate-bounce">
                {pendingLeaves}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowHistoryPopup(true)}
            className="border-2 border-white rounded-lg text-2xl mt-8 mb-5 mr-12 p-3 text-white font-semibold hover:bg-slate-700 bg-green-700 transition"
          >
            Leave History Search
          </button>
        </div>
      </div>
      <div>
        <div className="w-full rounded-xl  p-8 mt-0">
          <div className="w-full">
            <h2 className="text-white text-4xl font-semibold mb-6 text-center">
              Employee List
            </h2>
            <div className=" border-zinc-600  border-l border-r mt-16 mr-20 ml-20">
              <table className="w-full mt-2 ">
                <thead>
                  <tr>
                    {[
                      "S.No.",
                      "ID",
                      "Name",
                      "Last Login Date",
                      "Last Login Time",
                      "Actions",
                    ].map((headings, index) => {
                      return (
                        <th
                          key={index}
                          className="px-4 py-4 text-center text-lg text-white font-semibold"
                        >
                          {headings}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {employees.map((emp, idx) => (
                    <tr
                      key={emp.ID}
                      className="hover:bg-zinc-700 transition cursor-pointer"
                      onClick={() => setLeave_history(emp.leave_history)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-200">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-200">
                        {emp.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-100 font-medium">
                        {emp.username}
                      </td>
                      <td className="px-4 py-4 text-white text-center">
                        {emp.last_Login_date || "-"}
                      </td>
                      <td className="px-4 py-4 text-white text-center">
                        {emp.last_login_time || "-"}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(emp.ID);
                          }}
                          className="text-red-500  hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Leave Requests Popup */}
      {showLeavePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-white mb-4">Leave Requests</h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-300">No leave requests pending.</p>
            ) : (
              <ul>
                {leaveRequests.map((emp) => (
                  <li key={emp.ID} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">
                        {emp.username} (ID: {emp.ID})
                      </span>
                      <div>
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              onClick={() => {
                setShowLeavePopup(false);
                setSelectedEmployee(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Employee Leave Details Popup */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h3 className="text-xl text-white mb-2">
              Leave Details for {selectedEmployee.username}
            </h3>
            <p className="text-gray-300 mb-2">
              Reason: {selectedEmployee.asked_leave_reason || "-"}
            </p>
            <p className="text-gray-300 mb-2">
              Start Date: {selectedEmployee.leave_start || "-"}
            </p>
            <p className="text-gray-300 mb-2">
              End Date: {selectedEmployee.leave_end || "-"}
            </p>
            <div className="flex gap-6 justify-center mt-9">
              <button
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => handleLeaveAction(selectedEmployee.ID, "accept")}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleLeaveAction(selectedEmployee.ID, "reject")}
              >
                Reject
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setLeave_history(selectedEmployee.leave_history)}
              >
                View History
              </button>
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Leave History Popup */}
      {leave_history && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-semi-bold text-white mb-2">
              Leave History
            </h3>
            <ul>
              {leave_history.length === 0 ? (
                <li className="text-gray-300 text-2xl">
                  No leave history available.
                </li>
              ) : (
                leave_history.map((req, idx) => (
                  <li key={idx} className="mb-2">
                    <p className="text-gray-300 text-lg">
                      Leave Start : {req.start || "-"}
                    </p>
                    <p className="text-gray-300 text-lg">
                      Leave End : {req.end || "-"}
                    </p>
                    <p className="text-gray-300 text-lg">
                      Reason : {req.reason || req.asked_leave_reason || "-"}
                    </p>
                    <p className="text-gray-300 text-lg">
                      Status : {req.Status || "-"}
                    </p>
                  </li>
                ))
              )}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              onClick={() => setLeave_history(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Leave History Search Popup */}
      {showHistoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl text-white mb-8">Search Leave History</h2>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-10">
                <div>
                  <label className="text-gray-300 ">Start Date: </label>
                  <input
                    type="date"
                    value={historyStart}
                    onChange={(e) => setHistoryStart(e.target.value)}
                    className="rounded p-2 bg-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300">End Date: </label>
                  <input
                    type="date"
                    value={historyEnd}
                    onChange={(e) => setHistoryEnd(e.target.value)}
                    className="rounded p-2 bg-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-10">
                <button
                  className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={fetchLeaveHistory}
                >
                  Search
                </button>
                <button
                  className=" px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                  onClick={() => {
                    setShowHistoryPopup(false);
                    setHistoryResults([]);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {historyResults.length === 0 ? (
                <p className="text-gray-300">
                  No leave history found for this range.
                </p>
              ) : (
                <table className="w-full text-white border border-gray-700 mt-4">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Employee</th>
                      <th className="border px-2 py-1">ID</th>
                      <th className="border px-2 py-1">Reason</th>
                      <th className="border px-2 py-1">Start</th>
                      <th className="border px-2 py-1">End</th>
                      <th className="border px-2 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyResults.map((entry, idx) => {
                      console.log("History entry:", entry);
                      return (
                        <tr key={idx}>
                          <td className="border px-2 py-1">
                            {entry.employee || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {entry.ID || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {entry.reason || entry.asked_leave_reason || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {entry.start || entry.leave_start || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {entry.end || entry.leave_end || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {entry.Status || entry.status || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
