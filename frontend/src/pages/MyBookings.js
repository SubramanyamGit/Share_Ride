import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Container, Spinner, Alert, Modal, Button, Pagination } from "react-bootstrap";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";
import { toast } from "react-toastify";

// Fetch My Bookings API
const fetchMyBookings = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/bookings/my_bookings`
  );
  return response.data.data;
};

// Cancel Booking API
const cancelBooking = async (booking_id) => {
  const response = await axiosInstanceWithToken.delete(
    `${process.env.REACT_APP_API_URL}/bookings/${booking_id}`
  );
  return response.data;
};

function MyBookings() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch Bookings
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
  });

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / recordsPerPage);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cancel Booking Mutation
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking canceled successfully!", { position: "top-center" });
      queryClient.invalidateQueries(["myBookings"]);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to cancel booking: ${error.message}`, {
        position: "top-center",
      });
    },
  });

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.booking_id);
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading your bookings...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <p>Failed to load your bookings: {error.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>My Bookings</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Ride</th>
            <th>Seats Booked</th>
            <th>Booking Message</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Travel Date</th>
            <th>Travel Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking, index) => (
              <tr key={booking.booking_id}>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>
                  {booking.from_place} → {booking.to_place}
                </td>
                <td>{booking.no_of_seats}</td>
                <td>{booking.booking_message}</td>
                <td>{booking.payment_method}</td>
                <td>{booking.payment_status}</td>
                <td>{new Date(booking.travel_date).toLocaleDateString()}</td>
                <td>{booking.travel_time}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(booking)}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Bookings Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {bookings.length > recordsPerPage && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <Pagination.Item
                key={pageIndex + 1}
                active={currentPage === pageIndex + 1}
                onClick={() => handlePageChange(pageIndex + 1)}
              >
                {pageIndex + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmCancel}
            disabled={cancelMutation.isLoading}
          >
            {cancelMutation.isLoading ? "Cancelling..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyBookings;
