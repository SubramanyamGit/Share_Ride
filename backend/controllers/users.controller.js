const userModel = require("../models/users.model");

 const usersController  = {
  getAll: (req, callback) => {
    try {
      userModel.getAll(req, (err, data) => {
        if (err) {
          return callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  getMyDetails: (req, callback) => {
    try {
      userModel.getMyDetails(req, (err, data) => {
        if (err) {
          return callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  createUser: (req, callback) => {
    try {
      userModel.createUser(req, (err, data) => {
        if (err) {
          return callback(err);
        }
        if (data) {
          return callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },  updateUser: (req, callback) => {
    try {
      userModel.updateUser(req, (err, data) => {
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

module.exports = usersController