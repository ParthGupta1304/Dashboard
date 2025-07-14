// // server.js
// // Import express for creating the server
// import express from "express";
// // Import cors to enable Cross-Origin Resource Sharing
// import cors from "cors";
// // Import dotenv to load environment variables
// import dotenv from "dotenv";
// // Import authentication routes
// import authRoutes from "./routes/auth.js";

// dotenv.config();

// const app = express();

// // Enable CORS for all routes
// app.use(cors());

// // Parse incoming JSON requests
// app.use(express.json());

// // Mount authentication routes at /api/auth
// app.use("/api/auth", authRoutes);
// // Root route for health check
// app.get("/", (req, res) => {
//   res.send("Backend is working!");
// });

// // Start the server on the specified port
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(` Server running at http://localhost:${PORT}`);
// });
