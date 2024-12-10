const jwt = require("jsonwebtoken");
const db = require("./server");
const sendMail = require('../services/email_service')

const bookingsModel = {
  bookRide: (data, callback) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = data.header("authorization").split(" ");
    const verified = jwt.verify(token[1], jwtSecretKey);
    const { user_id: booked_by, full_name } = verified;
  
    try {
      const {
        ride_id,
        payment_method,
        payment_status,
        mobile_no,
        booking_message,
        no_of_seats,
        from_place,
        to_place,
        travel_time,
        travel_date,
      } = data.body;
  
      // Query to insert the booking details
      const insertBookingQuery = `
        INSERT INTO bookings (
          ride_id, booked_by, full_name, mobile_no, payment_method, payment_status,
          booking_message, no_of_seats, from_place, to_place, travel_time, travel_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
  
      // Query to fetch the email of the user who created the ride
      const getRideCreatorQuery = `
        SELECT users.email 
        FROM rides 
        JOIN users ON rides.created_by = users.user_id 
        WHERE rides.ride_id = ?;
      `;
  
      // Step 1: Insert the booking into the database
      db.query(
        insertBookingQuery,
        [
          ride_id,
          booked_by,
          full_name,
          mobile_no,
          payment_method,
          payment_status,
          booking_message,
          no_of_seats,
          from_place,
          to_place,
          travel_time,
          travel_date,
        ],
        (err, bookingResult) => {
          if (err) {
            return callback(err);
          }
  
          if (bookingResult) {
            // Step 2: Fetch the email of the user who created the ride
            db.query(getRideCreatorQuery, [ride_id], (emailErr, emailResult) => {
              if (emailErr) {
                return callback(emailErr);
              }
  
              if (emailResult && emailResult.length > 0) {
                const rideCreatorEmail = emailResult[0].email;
  
                // Step 3: Send emails to both the user booking the ride and the ride creator
                sendMail({
                  from: "subbu6144@gmail.com",
                  to: verified.email,
                  subject: "Ride Booked Successfully",
                  text: `Your ride has been booked successfully from ${from_place} to ${to_place}.`,
                });
  
                sendMail({
                  from: "subbu6144@gmail.com",
                  to: rideCreatorEmail,
                  subject: "Your Ride Has Been Booked",
                  text: `Your ride from ${from_place} to ${to_place} has been booked by ${full_name}.`,
                });
  
                callback(null, bookingResult);
              } else {
                callback(new Error("Ride creator email not found."));
              }
            });
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  },  
  getAllBookings: (data, callback) => {
    try {
      db.query("select * from bookings;", (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  getMyBookings: (data, callback) => {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const token = data.header("authorization").split(" ");
      const verified = jwt.verify(token[1], jwtSecretKey);
      const { user_id: booked_by } = verified;
      db.query(
        "select * from bookings where booked_by = ?;",
        [booked_by],
        (err, data) => {
          if (err) {
            callback(err);
          }
          if (data) {
            callback(null, data);
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  },
  deleteBooking: (data, callback) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = data.header("authorization").split(" ");
    const verified = jwt.verify(token[1], jwtSecretKey);
    const { booking_id } = data.params;
    const query = "delete from bookings where booking_id=?;";
    try {
      db.query(query, [booking_id], (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          sendMail({
            from: "subbu6144@gmail.com",
            to: verified.email,
            subject: "Ride Cancelled Successfully",
            text: `Your Ride Cancelled Successfully`,
          });
          callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
};

module.exports = bookingsModel;
