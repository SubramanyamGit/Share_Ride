const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/sign_up.controller");
const uniqueMiddleware = require("../middlewares/uniqueUserMiddleware");

router.post("/", uniqueMiddleware, (req, res) => {
  signUpController.signUp(req, (err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.error,
      });
    }
    if (response) {
      res.status(200).json({
        status: "Sign Up Successful",
        data: response,
      });
    }
  });
});

module.exports = router;
