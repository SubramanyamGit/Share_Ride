const signInModel = require("../models/sign_in.model");

module.exports = {
    signUp: (req, callback) => {
    try {
      signInModel.signIn(req, (err, data) => {
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
