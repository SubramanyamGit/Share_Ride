const jwt = require("jsonwebtoken");
const db = require("./server");
const sendMail = require('../services/email_service')
const ridesModel = {
  postRide: (data, callback) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = data.header("authorization").split(" ");
    const verified = jwt.verify(token[1], jwtSecretKey);
    const created_by = verified.user_id;
    const full_name = verified.full_name;
    try {
      const {
        from_place,
        to_place,
        pick_up_location,
        drop_location,
        price,
        car_type,
        no_of_seats_avlb,
        mobile_no,
        travel_date,
        travel_time,
      } = data.body;
      const query =
        "insert into rides(created_by,from_place,to_place,pick_up_location,drop_location,price,car_type,no_of_seats_avlb,mobile_no,full_name,travel_date,travel_time) values(?,?,?,?,?,?,?,?,?,?,?,?);";
      db.query(
        query,
        [
          created_by,
          from_place,
          to_place,
          pick_up_location,
          drop_location,
          price,
          car_type,
          no_of_seats_avlb,
          mobile_no,
          full_name,
          travel_date,
          travel_time,
        ],
        (err, data) => {
          if (err) {
            callback(err);
          }
          if (data) {
            sendMail({
              from: "subbu6144@gmail.com",
              to: verified.email,
              subject: "Ride Posted Successfully",
              text: `Your Ride Posted Successfully from ${from_place} to ${to_place}`,
            });
            callback(null, data);
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  },
  getAllRides: (data, callback) => {
    try {
      db.query("select * from rides;", (err, data) => {
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
  getMyRides: (data, callback) => {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const token = data.header("authorization").split(" ");
      const verified = jwt.verify(token[1], jwtSecretKey);
      const created_by = verified.user_id;
      db.query(
        "select * from rides where created_by = ?;",
        [created_by],
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
  updateRide: (data, callback) => {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const token = data.header("authorization").split(" ");
      const verified = jwt.verify(token[1], jwtSecretKey);
      const { ride_id } = data.body;
      const keysCanUpdate = [
        "pick_up_location",
        "drop_location",
        "no_of_seats_avlb",
        "ride_id",
      ];
      const keysForUpdate = Object.keys(data.body);
      console.log(keysForUpdate)
      let invalidFileds = false;
      keysForUpdate.forEach((key) => {
        if (!keysCanUpdate.includes(key) && !invalidFileds) {
          invalidFileds = true;
        }
      });
      if (invalidFileds) {
        return callback({ message: "Invalid Fileds to update" });
      }
      const query = `update rides set ${keysForUpdate
        .map((key) => `${key}=?`)
        .join(", ")} where ride_id =?`;
      db.query(query, [...Object.values(data.body), ride_id], (err, data) => {
        if (err) {
          callback(err);
        }
        if (data) {
          sendMail({
            from: "subbu6144@gmail.com",
            to: verified.email,
            subject: "Ride Updated Successfully",
            text: `Your Ride Updated Successfully`,
          });
          callback(null, data);
        }
      });
    } catch (error) {
      callback(error);
    }
  },
  deleteRide: (data, callback) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = data.header("authorization").split(" ");
    const verified = jwt.verify(token[1], jwtSecretKey); // Decoded token contains user details, including role
    const { ride_id } = data.params;
  
    // Query to get the email of the user who created the ride
    const getUserEmailQuery = `
      SELECT users.email, rides.created_by 
      FROM rides 
      JOIN users ON rides.created_by = users.user_id 
      WHERE rides.ride_id = ?;
    `;
  
    const deleteRideQuery = "DELETE FROM rides WHERE ride_id = ?;";
  
    try {
      // Step 1: Get the user's email and created_by
      db.query(getUserEmailQuery, [ride_id], (err, result) => {
        if (err) {
          return callback(err);
        }
  
        if (result && result.length > 0) {
          const { email: userEmail, created_by } = result[0];
  
          // Step 2: Delete the ride
          db.query(deleteRideQuery, [ride_id], (deleteErr, deleteData) => {
            if (deleteErr) {
              return callback(deleteErr);
            }
  
            if (deleteData) {
              let emailSubject = "";
              let emailText = "";
  
              // Step 3: Determine the sender (admin or the user themselves)
              if (verified.user_id === created_by) {
                // If the user is deleting their own ride
                emailSubject = "Your Ride Deleted Successfully";
                emailText = `You have successfully deleted your ride.`;
              } else {
                // If an admin is deleting the ride
                emailSubject = "Ride Deleted by Admin";
                emailText = `Your ride has been deleted by an admin.`;
              }
  
              // Step 4: Send email notification
              sendMail({
                from: "subbu6144@gmail.com",
                to: userEmail,
                subject: emailSubject,
                text: emailText,
              });
  
              callback(null, deleteData);
            }
          });
        } else {
          callback(new Error("No user found for the given ride ID."));
        }
      });
    } catch (error) {
      callback(error);
    }
  }
}  

module.exports = ridesModel;
