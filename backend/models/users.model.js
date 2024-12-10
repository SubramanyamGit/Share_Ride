const sql = require("./server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../services/email_service");

module.exports = {
  getAll: (data, callback) => {
    try {
      sql.query(
        "select full_name,email,user_role,user_status,user_id from users;",
        (err, data) => {
          if (err) {
            callback(err);
          }
          if (data) {
            callback(null, data);
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  },
  getMyDetails: (data, callback) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = data.header("authorization").split(" ");
    const verified = jwt.verify(token[1], jwtSecretKey);
    const { user_id } = verified;
    try {
      sql.query(
        "select full_name,email,user_role,user_status from users where user_id = ?;",
        [user_id],
        (err, data) => {
          if (err) {
            callback(err);
          }
          if (data) {
            callback(null, data);
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  },
  createUser: (data, callback) => {
    try {
      let { full_name, password, email, user_role } = data.body;
      const query =
        "insert into users(full_name,password,email,user_role) values(?,?,?,?)";
      password = bcrypt.hashSync(password, 10);
      sql.query(query, [full_name, password, email, user_role], (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          callback(null, { message: "User created sucessfully" });
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  updateUser: (data, callback) => {
    try {
      const { user_id, user_status } = data.body;
  
      // Query to update user status
      const updateQuery = `UPDATE users SET user_status = ? WHERE user_id = ?`;
  
      // Query to fetch the user's email
      const getEmailQuery = `SELECT email FROM users WHERE user_id = ?`;
  
      // Step 1: Update the user status
      sql.query(updateQuery, [user_status, user_id], (updateErr, updateData) => {
        if (updateErr) {
          console.error(updateErr);
          return callback(updateErr);
        }
  
        if (updateData) {
          // Step 2: Fetch the user's email
          sql.query(getEmailQuery, [user_id], (emailErr, emailResult) => {
            if (emailErr) {
              console.error(emailErr);
              return callback(emailErr);
            }
  
            if (emailResult && emailResult.length > 0) {
              const userEmail = emailResult[0].email;
  
              // Step 3: Send email notification
              const emailSubject = "Account Status Updated";
              const emailText = `Hello, your account status has been updated to: ${user_status}.`;
  
              sendMail({
                from: "subbu6144",
                to: userEmail,
                subject: emailSubject,
                text: emailText,
              });
  
              callback(null, updateData);
            } else {
              callback(new Error("User email not found."));
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }
  
};
