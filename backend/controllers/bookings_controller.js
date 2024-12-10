const bookingsModel = require("../models/bookings_model");

const bookingsController = {
  bookRide: (req, callback) => {
    try {
      bookingsModel.bookRide(req, (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  getAllBookings: (req, callback) => {
    try {
      bookingsModel.getAllBookings(req, (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  getMyBookings: (req, callback) => {
    try {
      bookingsModel.getMyBookings(req, (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  deleteBooking: (req, callback) => {
    try {
      bookingsModel.deleteBooking(req, (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
};

module.exports = bookingsController;
