// Home component for landing page navigation
import { Link } from "react-router-dom";

const Home = () => {
  // Render the home page with navigation links
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-slate-400 via-zinc-300 to-gray-100 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="text-white text-6xl">Dashboard</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-700 to-zinc-900 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-zinc-900 transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
          >
            <span>Log In</span>
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-slate-600 hover:bg-slate-800/20 transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
          >
            <span>Create Account</span>
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;