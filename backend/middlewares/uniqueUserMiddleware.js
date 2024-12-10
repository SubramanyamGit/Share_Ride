const sql = require("../models/server");

const uniqueMiddleware = (req, res, next) => {
  try {
    const { email } = req.body;
    sql.query("select * from users where email=?", [email], (err, data) => {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      if (data.length) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (!data.length) {
        next();
      }
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

module.exports = uniqueMiddleware;
