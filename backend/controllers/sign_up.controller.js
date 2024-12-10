const signUpModel = require("../models/sign_up.model");

module.exports = {
    signUp: (req, callback) => {
    try {
      signUpModel.signUp(req, (err, data) => {
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
};
