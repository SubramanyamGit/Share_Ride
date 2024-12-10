const ridesModel = require("../models/rides_model");

const ridesController = {
  postRide: (req, callback) => {
    try {
      ridesModel.postRide(req, (err, data) => {
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
  getAllRides: (req, callback) => {
    try {
      ridesModel.getAllRides(req, (err, data) => {
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
  getMyRides: (req, callback) => {
    try {
      ridesModel.getMyRides(req, (err, data) => {
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
  updateRide: (req, callback) => {
    try {
      ridesModel.updateRide(req, (err, data) => {
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
  deleteRide: (req, callback) => {
    try {
      ridesModel.deleteRide(req, (err, data) => {
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

module.exports = ridesController;
