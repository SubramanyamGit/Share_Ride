import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Container, Button } from "react-bootstrap";
import axios from "axios";

const bookRide = async (rideDetails) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/book-ride`, rideDetails);
  return response.data;
};

function BookRide({ ride }) {
  const mutation = useMutation(bookRide);

  const handleBook = () => {
    const bookingDetails = { ride_id: ride.ride_id, user_id: "123" }; // Sample data
    mutation.mutate(bookingDetails, {
      onSuccess: () => {
        alert("Ride booked successfully!");
      },
      onError: (error) => {
        alert(`Booking failed: ${error.message}`);
      },
    });
  };

  return (
    <Container>
      <h2>Book Ride</h2>
      <p>
        Ride from <strong>{ride.from_place}</strong> to <strong>{ride.to_place}</strong>
      </p>
      <Button variant="primary" onClick={handleBook} disabled={mutation.isLoading}>
        {mutation.isLoading ? "Booking..." : "Book Now"}
      </Button>
    </Container>
  );
}

export default BookRide;
