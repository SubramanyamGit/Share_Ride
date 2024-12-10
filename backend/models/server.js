const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Subbu@123",
  database: "rent_or_share_ride",
});

connection.connect;
(err) => {
  if (err) {
    return console.log("Error:" + err.message);
  }
  console.log("Connected to the MySQL server.");
};

module.exports = connection;
