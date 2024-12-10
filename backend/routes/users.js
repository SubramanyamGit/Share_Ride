const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware")
const uniqueMiddleware = require('../middlewares/uniqueUserMiddleware')


router.get("/",authenticateMiddleware, (req, res) => {
  usersController.getAll(req,(err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.error,
      });
    }
    if (response) {
      res.status(200).json({
        status: "Users fetched successfully",
        data: response,
      });
    }
  });
});

router.get("/my_details",authenticateMiddleware, (req, res) => {
  usersController.getMyDetails(req,(err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.error,
      });
    }
    if (response) {
      res.status(200).json({
        status: "User data fetched sucessfully",
        data: response,
      });
    }
  });
});

router.post("/", uniqueMiddleware, authenticateMiddleware, (req, res) => {
  usersController.createUser(req, (err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.error,
      });
    }
    if (response) {
      res.status(200).json({
        status: "User created sucessfully",
        data: response,
      });
    }
  });
});

router.patch("/",authenticateMiddleware, (req, res) => {
  usersController.updateUser(req,(err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.error,
      });
    }
    if (response) {
      res.status(200).json({
        status: "Users fetched successfully",
        data: response,
      });
    }
  });
});

module.exports = router;
