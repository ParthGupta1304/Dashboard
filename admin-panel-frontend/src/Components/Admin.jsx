// Admin panel component for managing employees
import { useState, useEffect } from "react";
import axios from "axios";

const Admin = ({ adminId }) => {
  // State for employee list and admin name
  const [employees, setEmployees] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees on mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/admin")
      .then((res) => {
        setEmployees(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Fetch admin name by ID on mount or when adminId changes
  useEffect(() => {
    if (adminId) {
      axios
        .get(`http://localhost:3000/api/auth/admin/${Id}`)
        .then((res) => setAdminName(res.data.username))
        .catch(() => setAdminName("Admin"));
    }
  }, [adminId]);

  // Remove an employee by ID
  const handleRemove = (ID) => {
    axios
      .delete(`http://localhost:3000/api/auth/admin/${ID}`)
      .then(() => setEmployees(employees.filter((e) => e.ID !== ID)))
      .catch((err) => alert("Error removing employee"));
  };

  // Show popup with employees who have requested leave
  const handleGrantLeave = () => {
    const requests = employees.filter((e) => e.asked_leave_status);
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
      await axios.patch(
        `http://localhost:3000/api/auth/admin/${ID}/grant-leave`,
        { action }
      );
      alert(`Leave ${action}ed successfully!`);
      setShowLeavePopup(false);
      setSelectedEmployee(null);
      // Refresh employees list
      const res = await axios.get("http://localhost:3000/api/auth/admin");
      setEmployees(res.data);
    } catch (err) {
      alert("Error updating leave status");
    }
  };

  // Calculate pending leave requests
  const pendingLeaves = employees.filter((e) => e.asked_leave_status).length;

  // Render the admin panel UI
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-slate-950 to-gray-950 ">
      <div className="flex justify-between gap-10 border-b-2 border-gray-700">
        <h1 className=" text-white text-6xl font-semibold mb-5 mr-5 mt-8  font-[FoundersGrotesk] ml-8 bg-gradient-to-r from-slate-400 via-zinc-300 to-gray-100 bg-clip-text ">
          Welcome Admin {adminName}
        </h1>
        <button
          onClick={handleGrantLeave}
          className="relative border-2 border-white rounded-lg text-2xl mt-8 mb-5 mr-12 p-3 text-white font-semibold hover:bg-slate-700 bg-blue-700 transition"
        >
          Leaves
          {pendingLeaves > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold animate-bounce">
              {pendingLeaves}
            </span>
          )}
        </button>
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
                    <tr key={emp.ID} className="hover:bg-zinc-700 transition">
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
                          onClick={() => handleRemove(emp.ID)}
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
          <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
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
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
