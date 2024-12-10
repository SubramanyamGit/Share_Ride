-- Create Database
CREATE DATABASE RENT_OR_SHARE_RIDE;

-- Use Database
USE RENT_OR_SHARE_RIDE;

-- Create users table
CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL,
    user_role VARCHAR(100) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert into user table
INSERT INTO users(full_name,password,email,user_role)
VALUES
('Subramanyam SIliveri','pass','subramanyamsilveri@gmail.com','admin'),
('Subbu Siliveri','pass','subbu6144@gmail.com','user');


-- Create rides table
CREATE TABLE rides (
    ride_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    created_by INTEGER NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100) NOT NULL,
    from_place VARCHAR(100) NOT NULL,
    to_place VARCHAR(100) NOT NULL,
    pick_up_location VARCHAR(100) NOT NULL,
    drop_location VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    car_type ENUM('small', 'medium', 'large') NOT NULL,
    no_of_seats_avlb INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    travel_time TIME NOT NULL,
    mobile_no VARCHAR(15) NOT NULL;
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create bookings table
CREATE TABLE bookings(
    booking_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    ride_id INTEGER NOT NULL,
    booked_by INTEGER NOT NULL,
    booked_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100) NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    booking_message VARCHAR(255),
    no_of_seats INTEGER NOT NULL
);