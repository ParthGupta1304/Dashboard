const express = require("express");
const app = express();
const userModel = require("./mongoconnection.js");
const cors = require("cors");

app.use(cors());
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
    console.log("User created:", newUser);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// app.post("/api/auth/login", async (req, res) => {
//   // Validate user input
//   const { username, password, ID } = req.body;
//   if (!username || !password || !ID) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

app.post("/api/auth/login", async (req, res) => {
  const { username, password, ID } = req.body;

  // Validate user input
  if (!username || !password || !ID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const user = await userModel.findOne({ username, password, ID });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const now = new Date();
    const login_date = now.toLocaleDateString();
    const login_time = now.toLocaleTimeString();
    user.last_Login_date = login_date;
    user.last_login_time = login_time;
    await user.save();

    res;
    status(200).json({ message: "Login successful", user, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/auth/admin", async (req, res) => {
  try {
    const employees = await userModel.find({ role: "employee" });
    res.send(employees);
    console.log(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/auth/admin/:ID", async (req, res) => {
  const { ID } = req.params;
  try {
    await userModel.findOneAndDelete({ ID });
    res.status(204).send();
  } catch (error) {
    console.error("Error removing employee:", error);
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
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.get("/api/auth/employee/:ID/ask-leave", async (req, res) => {
//   const { ID } = req.params;
//   try {
//     const employee = await userModel.findOne({ ID: Number(ID) });
//     if (!employee)
//       return res.status(404).json({ message: "Employee not found" });
//     console.log("Employee fetched:", employee);
//     if (employee.asked_leave_status) {
//       return res.status(400).json({ message: "Leave already requested" });
//     } else {
//       employee.asked_leave_status = true;
//       employee.leaveAskedCount += 1;
//       // employee.asked_leave_reason = "Leave requested by employee";
//       await employee.save();
//       res.status(200).json({ message: "Leave requested successfully" });
//     }
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

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
    // console.log(admin_approval);
    // Add to leave_history
    employee.leave_history.push({
      reason: asked_leave_reason,
      start: leave_start,
      end: leave_end,
      ID: employee.ID,
      admin_approval: true,
    });
    await employee.save();
    res.status(200).json({ message: "Leave requested successfully" });
  } catch (error) {
    console.error("Error updating leave request:", error);
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
    }
    // Reset leave request fields
    employee.admin_approval = false;
    await employee.save();
    res.status(200).json({ message: `Leave ${action}ed successfully` });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("MongoDB API is running on http://localhost:3000");
});
