// // auth.js
// import express from "express";
// import db from "../db.js";

// const router = express.Router(); // Create a new router instance

// // Route to egister a new user (admin or employee)
// router.post("/signup", (req, res) => {
//   const { username, email, password, role, ID } = req.body;
//   const checkIdQuery = "SELECT * FROM users WHERE id = ?";
//   db.query(checkIdQuery, [ID], (err, results) => {
//     if (err) return res.status(500).send("Database error");
//     if (results.length > 0) {
//       return res
//         .status(400)
//         .send("ID already exists. Please choose a different ID.");
//     }

//     const insertQuery =
//       "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
//     db.query(
//       insertQuery,
//       [ID, username, email, password, role],
//       (err, result) => {
//         if (err) return res.status(500).send(err);
//         return res.status(201).send("User registered successfully");
//       }
//     );
//   });
// });

// // Route to log in a user (admin or employee)
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const query = "SELECT * FROM users WHERE username = ? AND password = ?";
//   db.query(query, [username, password], (err, results) => {
//     if (err) return res.status(500).send(err);
//     if (results.length === 0)
//       return res.status(401).send("Invalid credentials");
//     return res.status(200).json(results[0]);
//   });
// });

// // Route to get all employees for admin panel
// router.get("/admin", (req, res) => {
//   const query =
//     "SELECT id, username AS name, leaveGranted, askedLeave FROM users WHERE role = 'employee'";
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).send("Database error");
//     res.json(results);
//   });
// });

// // Route to get admin's name by ID
// router.get("/admin/:id", (req, res) => {
//   const { id } = req.params;
//   db.query(
//     "SELECT username FROM users WHERE id = ? AND role = 'admin'",
//     [id],
//     (err, results) => {
//       if (err) return res.status(500).send("Database error");
//       if (results.length === 0) return res.status(404).send("Admin not found");
//       res.json({ username: results[0].username });
//     }
//   );
// });

// // Route to delete an employee by ID
// router.delete("/admin/:id", (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM users WHERE id = ?";
//   db.query(query, [id], (err, result) => {
//     console.log(result);
//     if (err) return res.status(500).send("Database error");
//     if (result.affectedRows === 0) {
//       return res.status(404).send("Employee not found");
//     }
//     res.send("Employee deleted successfully");
//   });
// });

// // Route to get all employees (for employee dashboard)
// router.get("/employee", (req, res) => {
//   const query = "SELECT * FROM users WHERE role = 'employee'";
//   db.query(query, (err, results) => {
//     console.log("Fetching employees:", results);
//     if (err) return res.status(500).send("Database error");
//     res.json(results);
//   });
// });
// // Route to get a single employee by ID
// router.get("/employee/:id", (req, res) => {
//   const { id } = req.params;
//   db.query(
//     "SELECT * FROM users WHERE id = ? AND role = 'employee'",
//     [id],
//     (err, results) => {
//       if (err) return res.status(500).send("Database error");
//       if (results.length === 0)
//         return res.status(404).send("Employee not found");
//       res.json(results[0]);
//     }
//   );
// });

// // Route for employee to request leave (increments leaveAskedCount)
// router.patch("/employee/:id/ask-leave", (req, res) => {
//   const { id } = req.params;
//   const query = `
//     UPDATE users 
//     SET askedLeave = 1, leaveAskedCount = leaveAskedCount + 1 
//     WHERE id = ?
//   `;
//   db.query(query, [id], (err, result) => {
//     if (err) return res.status(500).send("Database error");
//     if (result.affectedRows === 0)
//       return res.status(404).send("Employee not found");
//     res.send("Leave requested successfully");
//   });
// });

// // Route for admin to grant/deny leave (increments leaveGrantedCount)
// router.put("/admin/:id/leave", (req, res) => {
//   const { id } = req.params;
//   const { leaveGranted } = req.body; // ✅ match frontend

//   const query = `
//     UPDATE users 
//     SET leaveGranted = ?, 
//         leaveGrantedCount = leaveGrantedCount + ?, 
//         askedLeave = askedLeave 
//     WHERE id = ?
//   `;
//   db.query(
//     query,
//     [leaveGranted ? 1 : 0, leaveGranted ? 1 : 0, id],
//     (err, result) => {
//       if (err) return res.status(500).send("Database error");
//       if (result.affectedRows === 0)
//         return res.status(404).send("Employee not found");
//       res.send("Leave status updated");
//     }
//   );
// });

// export default router;