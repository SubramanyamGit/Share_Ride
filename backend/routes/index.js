const users = require("./users");
const signUp = require('./sign_up')
const signIn = require('./sign_in') 
const rides = require("./rides")
const bookings = require("./bookings")


module.exports.initialize = (app) => {
  app.use("/users", users);
  app.use("/sign_up", signUp);
  app.use("/sign_in", signIn);
  app.use("/rides",rides);
  app.use("/bookings",bookings)
};
