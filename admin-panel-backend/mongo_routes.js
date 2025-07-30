const express = require("express");
const mongoose = require("mongoose"); // Add this line
const app = express();
const userModel = require("./mongoconnection.js");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Update CORS configuration for Render and Vercel deployment
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://*.onrender.com",
      /^https:\/\/.*\.onrender\.com$/,
      "https://dashboard-git-main-parthgupta1304s-projects.vercel.app",
      /^https:\/\/.*\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MongoDB API is working!");
});

app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password, ID, role } = req.body;

  // Validate user input
  if (!username || !email || !password || !ID || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Get current date and time
    const now = new Date();
    const signup_date = now.toLocaleDateString();
    const signup_time = now.toLocaleTimeString();

    // Create a new user document
    const newUser = new userModel({
      username,
      email,
      password,
      ID,
      role,
      signup_date,
      signup_time,
    });

    // Save the user to the database
    await newUser.save();
    console.log("✅ User created:", newUser);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password, ID } = req.body;

  // Validate user input
  if (!username || !password || !ID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const user = await userModel.findOne({ username, password, ID });
    console.log("🔍 Login attempt for user:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const now = new Date();
    const login_date = now.toLocaleDateString();
    const login_time = now.toLocaleTimeString();
    user.last_Login_date = login_date;
    user.last_login_time = login_time;
    await user.save();
    console.log("✅ User logged in:", user);

    res.status(200).json({ message: "Login successful", user, role: user.role });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    console.error("❌ Request body:", req.body);
    if (error.stack) console.error(error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.get("/api/auth/admin", async (req, res) => {
  try {
    const employees = await userModel.find({ role: "employee" });
    res.send(employees);
    console.log("📋 Employees fetched:", employees.length);
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/auth/admin/:ID", async (req, res) => {
  const { ID } = req.params;
  try {
    await userModel.findOneAndDelete({ ID });
    console.log("🗑️ Employee deleted:", ID);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error removing employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/auth/employee/:ID", async (req, res) => {
  const { ID } = req.params;
  try {
    const employee = await userModel.findOne({ ID: Number(ID) });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    // Reset leave fields in DB if leave end date has passed
    if (employee.leave_end) {
      const today = new Date();
      const endDate = new Date(employee.leave_end);
      if (today > endDate) {
        employee.asked_leave_status = false;
        employee.asked_leave_reason = "";
        employee.leave_start = "";
        employee.leave_end = "";
        await employee.save();
      }
    }
    res.send(employee);
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/auth/employee/:ID/ask-leave", async (req, res) => {
  const { ID } = req.params;
  const { asked_leave_reason, leave_start, leave_end, admin_approval } =
    req.body;
  try {
    const employee = await userModel.findOne({ ID: Number(ID) });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    if (employee.asked_leave_status) {
      return res.status(400).json({ message: "Leave already requested" });
    }
    employee.asked_leave_status = true;
    employee.leaveAskedCount += 1;
    employee.asked_leave_reason = asked_leave_reason;
    employee.leave_start = leave_start;
    employee.leave_end = leave_end;
    employee.admin_approval = true; // Set admin approval status

    // Add to leave_history
    employee.leave_history.push({
      reason: asked_leave_reason,
      start: leave_start,
      end: leave_end,
      ID: employee.ID,
      admin_approval: true,
    });
    await employee.save();
    console.log("🏖️ Leave requested for:", employee.username);
    res.status(200).json({ message: "Leave requested successfully" });
  } catch (error) {
    console.error("❌ Error updating leave request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin grants or rejects leave for an employee
app.patch("/api/auth/admin/:ID/grant-leave", async (req, res) => {
  const { ID } = req.params;
  const { action } = req.body; // action: "accept" or "reject"
  try {
    const employee = await userModel.findOne({ ID: Number(ID) });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    if (!employee.asked_leave_status) {
      return res.status(400).json({ message: "No leave request pending" });
    }
    if (action === "accept") {
      employee.leaves_granted = (employee.leaves_granted || 0) + 1;
      employee.leave_history[employee.leave_history.length - 1].Status =
        "Accepted";
    } else if (action === "reject") {
      employee.leave_history[employee.leave_history.length - 1].Status =
        "Rejected";
    }
    // Reset leave request fields
    employee.admin_approval = false;
    await employee.save();
    console.log(`✅ Leave ${action}ed for:`, employee.username);
    res.status(200).json({ message: `Leave ${action}ed ` });
  } catch (error) {
    console.error("❌ Error updating leave status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/auth/admin/:ID", async (req, res) => {
  const { ID } = req.params;
  console.log("👤 Admin request for ID:", ID);

  try {
    const admin = await userModel.findOne({ ID: Number(ID), role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    console.log("✅ Admin fetched:", admin.username);
    res.send(admin);
  } catch (error) {
    console.error("❌ Error fetching admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all leave history for all employees between two dates
app.post("/api/auth/leave-history-range", async (req, res) => {
  const { start, end } = req.body;
  if (!start || !end) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required" });
  }
  try {
    const employees = await userModel.find({});
    const startDate = new Date(start);
    const endDate = new Date(end);
    let results = [];

    employees.forEach((emp) => {
      if (Array.isArray(emp.leave_history)) {
        emp.leave_history.forEach((entry) => {
          if (entry.start && entry.end) {
            const entryStart = new Date(entry.start);
            const entryEnd = new Date(entry.end);
            // Check if leave overlaps with the range
            if (
              (entryStart >= startDate && entryStart <= endDate) ||
              (entryEnd >= startDate && entryEnd <= endDate) ||
              (entryStart <= startDate && entryEnd >= endDate)
            ) {
              results.push({
                employee: emp.username,
                ID: emp.ID,
                reason: entry.reason || entry.asked_leave_reason,
                start: entry.start || entry.leave_start,
                end: entry.end || entry.leave_end,
                Status: entry.Status || entry.status || "Pending",
              });
            }
          }
        });
      }
    });

    console.log("📊 Leave history search results:", results.length);
    res.json({ history: results });
  } catch (error) {
    console.error("❌ Error fetching leave history by range:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Test database connection route
app.get("/api/test-db", async (req, res) => {
  try {
    console.log("🧪 Testing database connection...");

    // Check connection status
    console.log("📊 Database name:", mongoose.connection.db.databaseName);
    console.log("🔗 Connection state:", mongoose.connection.readyState); // 1 = connected

    // Count all users
    const userCount = await userModel.countDocuments();
    console.log("📊 Total users in database:", userCount);

    // List all users (limit to 10 for readability)
    const allUsers = await userModel.find({}).limit(10);
    console.log("👥 Users found:", allUsers.length);

    res.json({
      success: true,
      message: "Database connection successful",
      database: mongoose.connection.db.databaseName,
      connectionState: mongoose.connection.readyState,
      userCount,
      users: allUsers.map((user) => ({
        username: user.username,
        ID: user.ID,
        role: user.role,
        email: user.email,
      })),
    });
  } catch (error) {
    console.error("❌ Database test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MongoDB API is running on http://localhost:${PORT}`);
});

module.exports = app;
