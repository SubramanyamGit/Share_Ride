const express = require("express");
const router = express.Router();
const signInController = require("../controllers/sign_in.controller");

router.post("/", (req, res) => {
  signInController.signUp(req, (err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.message,
      });
    }
    if (response) {
      res.status(200).json({
        status: "SignIn Successful",
        data: response,
      });
    }
  });
});

module.exports = router;
