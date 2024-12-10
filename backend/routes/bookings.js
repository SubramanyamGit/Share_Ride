const express = require("express");
const bookingsController = require("../controllers/bookings_controller");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware")
const router = express.Router();

router.post("/", authenticateMiddleware, (req, res) => {
  bookingsController.bookRide(req, (err, response) => {
    if (err) {
      res.status(401).json({
        status: "Failure",
        message: err.message,
      });
    }
    if (response) {
      res.status(200).json({
        status: "Ride Booked Successfully",
        data: response,
      });
    }
  });
});

router.get("/",authenticateMiddleware, (req,res)=>{
    bookingsController.getAllBookings(req,(err,response)=>{
      if(err){
        res.status(401).json({
          status: "Failure",
          message: err.message,
        })
      }
      if (response) {
        res.status(200).json({
          status: "Bookings Fetched Successfully",
          data: response,
        });
      }
    })
})

router.get("/my_bookings",authenticateMiddleware, (req,res)=>{
  bookingsController.getMyBookings(req,(err,response)=>{
    if(err){
      res.status(401).json({
        status: "Failure",
        message: err.message,
      })
    }
    if (response) {
      res.status(200).json({
        status: "Bookings Fetched Successfully",
        data: response,
      });
    }
  })
})

router.delete("/:booking_id",authenticateMiddleware, (req,res)=>{
  bookingsController.deleteBooking(req,(err,response)=>{
    if(err){
      res.status(401).json({
        status: "Failure",
        message: err.message,
      })
    }
    if (response) {
      res.status(200).json({
        status: "Cancelled Booking Successfully",
        data: response,
      });
    }
  })
})

module.exports  = router