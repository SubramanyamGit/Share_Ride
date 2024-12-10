const express = require("express");
const ridesController = require("../controllers/rides_controller");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware")
const router = express.Router();

router.post("/", authenticateMiddleware, (req, res) => {
  ridesController.postRide(req, (err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.message,
      });
    }
    if (response) {
      res.status(200).json({
        status: "Created Ride Successfully",
        data: response,
      });
    }
  });
});

router.get("/",authenticateMiddleware, (req,res)=>{
    ridesController.getAllRides(req,(err,response)=>{
      if(err){
        res.status(401).json({
          status: "Failure",
          message: err.message,
        })
      }
      if (response) {
        res.status(200).json({
          status: "Fetched Rides Successfully",
          data: response,
        });
      }
    })
})

router.get("/my_rides",authenticateMiddleware, (req,res)=>{
  ridesController.getMyRides(req,(err,response)=>{
    if(err){
      res.status(401).json({
        status: "Failure",
        message: err.message,
      })
    }
    if (response) {
      res.status(200).json({
        status: "Fetched Rides Successfully",
        data: response,
      });
    }
  })
})

router.patch("/",authenticateMiddleware, (req,res)=>{
  ridesController.updateRide(req,(err,response)=>{
    if(err){
      res.status(401).json({
        status: "Failure",
        message: err.message,
      })
    }
    if (response) {
      res.status(200).json({
        status: "Updated Ride Successfully",
        data: response,
      });
    }
  })
})

router.delete("/:ride_id",authenticateMiddleware, (req,res)=>{
  ridesController.deleteRide(req,(err,response)=>{
    if(err){
      res.status(401).json({
        status: "Failure",
        message: err.message,
      })
    }
    if (response) {
      res.status(200).json({
        status: "Deleted Ride Successfully",
        data: response,
      });
    }
  })
})

module.exports  = router