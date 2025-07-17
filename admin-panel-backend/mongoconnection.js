const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/employees")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
const userSchema = new mongoose.Schema({
  S_No: Number,
  username: String,
  email: String,
  password: String,
  ID: Number,
  role: String,
  last_Login_date: String,
  last_login_time: String,
  leaves_granted: Number,
  leaveAskedCount: { type: Number, default: 0 },
  asked_leave_status: { type: Boolean, default: false },
  asked_leave_reason: String,
  leave_start: String,
  leave_end: String,
  signup_date: String,
  signup_time: String,
  admin_approval: {type: Boolean, default: false},
  leave_history: [
    {
      reason: String,
      start: String,
      end: String,
      ID: Number,
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
