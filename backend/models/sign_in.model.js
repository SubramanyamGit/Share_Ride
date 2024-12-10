const sql = require("./server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signIn: (data, callback) => {
    try {
      const { email, password: InputPassword } = data.body;
      const query =
        "select user_id,password,full_name,user_role,user_status from users where email=?";
      sql.query(query, [email], (err, data) => {
        if (err) {
          callback(err);
        }
        if (data && data.length) {
          const { password, user_id, full_name,user_role,user_status } = data[0];
          const isPasswordCrt = bcrypt.compareSync(InputPassword, password);
          if(user_status === 'Inactive'){
           return callback({message:"SignIn Declined Contact Admin"})
          }
          if (!isPasswordCrt) {
            return callback({ message: "Invalid Credentials" });
          }
          if (isPasswordCrt) {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ user_id, full_name,email }, jwtSecretKey);
            callback(null, { token, user_role });
          }
        } else {
          callback({ message: "Invalid Credentials" });
        }
      });
    } catch (error) {
      callback(error);
    }
  },
};
