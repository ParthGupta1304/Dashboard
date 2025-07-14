// // Import mysql2 for MySQL database connection
// import mysql from "mysql2";
// // Import dotenv to load environment variables from .env file
// import dotenv from "dotenv";
// dotenv.config();

// // Create a MySQL connection using environment variables
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Connect to the database and log success or throw error
// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ Connected to MySQL Database");
// });

// export default db;
