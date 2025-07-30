import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const SignUp = () => {
  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserdata({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const generateRandomID = () => {
    return Math.floor(
      (148484 + Math.random() * 3939393 + Date.now()) % 1000000
    ); // 6-digit random ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return alert("Please select a role");

    const newID = generateRandomID();

    try {
      const response = await axios.post(API_ENDPOINTS.SIGNUP, {
        ...userdata,
        ID: newID,
        role,
      });
      console.log(response.data);
      alert(`Account created successfully! Your ID is ${newID}`);
      if (response.status === 201) {
        if (role === "admin") {
          navigate(`/admin/${newID}`);
        } else {
          navigate(`/employee/${newID}`);
        }
      }
    } catch (error) {
      console.error("SIGNUP ERROR:", error.response?.data || error.message);
      if (error.response && error.response.status === 409) {
        alert("Email is already registered. Please use a different email.");
      } else {
        alert("Error creating account. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-gray-900 p-7 flex items-center justify-center">
      <div className="w-full max-w-md transform transition-all">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-lg bg-zinc-900 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-3 border-white/10"
        >
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-white bg-clip-text text-transparent">
              Create Account
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-slate-300 bg-zinc-800 border border-zinc-700 text-white"
                placeholder="Choose a username"
                value={userdata.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 focus:outline-none focus:border-slate-300 border border-zinc-700 text-white"
                placeholder="Enter your email"
                value={userdata.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border focus:outline-none focus:border-slate-300 border-zinc-700 text-white"
                placeholder="Choose a strong password"
                value={userdata.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-4 rounded-lg border ${
                    role === "admin"
                      ? "border-slate-500 bg-slate-700/30 text-slate-300"
                      : "border-zinc-700 bg-zinc-800 text-gray-400"
                  } hover:border-slate-400 transition-all duration-200`}
                >
                  <span className="font-medium">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("employee")}
                  className={`p-4 rounded-lg border ${
                    role === "employee"
                      ? "border-slate-500 bg-slate-700/30 text-slate-300"
                      : "border-zinc-700 bg-zinc-800 text-gray-400"
                  } hover:border-slate-400 transition-all duration-200`}
                >
                  <span className="font-medium">Employee</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !role ||
                !userdata.username ||
                !userdata.email ||
                !userdata.password
              }
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-slate-500 to-zinc-700 text-white font-medium hover:from-slate-800 hover:to-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
