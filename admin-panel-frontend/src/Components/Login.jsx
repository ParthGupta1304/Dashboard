// Login component for user authentication
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [userinfo, setUserinfo] = useState({
    username: "",
    password: "",
    ID: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserinfo({
      ...userinfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, userinfo);

      console.log(response.data);

      if (response.data.role === "admin") {
        navigate(`/admin/${userinfo.ID}`);
      } else if (response.data.role === "employee") {
        navigate(`/employee/${userinfo.ID}`);
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
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
            <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-400 mt-2">Please enter your credentials</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                placeholder="Enter your username"
                value={userinfo.username}
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
                className="w-full px-4 py-3 mb-5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                placeholder="Enter your password"
                value={userinfo.password}
                onChange={handleChange}
              />
              <label className="text-sm font-medium text-gray-300 block mb-2">
                ID
              </label>
              <input
                type="number"
                name="ID"
                className="w-full px-4 py-3 mb-5 mt-0 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                placeholder="Enter your ID"
                value={userinfo.ID}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-slate-700 to-zinc-800 text-white font-medium hover:from-slate-800 hover:to-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log In
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-300 hover:text-blue-500 font-medium"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
