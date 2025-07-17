# Dashboard (MERN Stack)

A robust role-based dashboard featuring Admin & Employee interfaces, built with the MERN stack (MongoDB, Express, React, Node.js). This project showcases end-to-end full‑stack development, featuring authentication, authorization, user management, leave requests, and login tracking.

---

## ⚙️ Key Features

- **Role-based Access Control (RBAC):**
  - **Admin**: Manage employees, approve/reject leave requests, view login timestamps, add/remove employees.
  - **Employee**: Request leave with justification, view their own status/logins.

- **Authentication & Authorization**:
  - A unique and random ID is created the time a new user Signups

- **CRUD Operations**:
  - Admin can perform create/update/delete on employee accounts.
  - Employee can create and monitor their leave requests.

- **Logging & Auditing**:
  - Tracks and displays last login date/time for each user.

---

## 📦 Tech Stack

| Layer         | Technologies                          |
|---------------|---------------------------------------|
| Frontend      | React, Tailwind CSS                   |
| Backend       | Node.js, Express                      |
| Database      | MongoDB with Mongoose ODM             |
| Dev Tools     | Git, ESLint, Prettier                 |

---

## 🚀 Installation & Setup

1. **Clone the repo**  
   `git clone https://github.com/ParthGupta1304/Dashboard.git`

2. ** Backend **  
   ```bash
   cd Dashboard/backend
   npm install
   npm run dev
   
3. ** Frontend **
   ```bash
   cd ../frontend
   npm install
   npm start
   
4. Test the app
   Register or seed MongoDB with Admin & Employee users.
   Login as Admin → manage users, view logs, process leave.
   Login as Employee → request leave, view submission/status.
   

🧩 Architecture Overview
   [React UI] ←→ [Express API Server] ←→ [MongoDB Database]

   
✅ What I Learned
1. Practical experience with full-stack MERN architecture.
2. How to implement secure auth flows, role-based middleware, and CRUD with MongoDB.
3. UI design using React + Tailwind for a clean and responsive dashboard layout.


🛠️ Contribution
This is my personal portfolio project. I will be push changes on regular basis. 


📞 Contact
Parth Gupta – parthg1304@gmail.com
Linkedn - linkedin.com/in/parth-gupta-0a4076266
Git Hub - https://github.com/ParthGupta1304




