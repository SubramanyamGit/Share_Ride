import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  Pagination,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

// Fetch rides function
const fetchRides = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/rides`
  );
  return response.data.data;
};

// Delete ride function
const deleteRide = async (rideId) => {
  await axiosInstanceWithToken.delete(
    `${process.env.REACT_APP_API_URL}/rides/${rideId}`
  );
};

function AllRides({ role }) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch rides using useQuery
  const {
    data: rides = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rides"],
    queryFn: fetchRides,
  });

  // Paginate rides
  const totalPages = Math.ceil(rides.length / recordsPerPage);
  const paginatedRides = rides.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Mutation for deleting a ride
  const deleteMutation = useMutation({
    mutationFn: deleteRide,
    onSuccess: () => {
      toast.success("Ride deleted successfully!", { position: "top-center" });
      queryClient.invalidateQueries(["rides"]);
      setShowModal(false);
    },
    onError: () => {
      toast.error("Failed to delete ride.", { position: "top-center" });
    },
  });

  // Handler for opening the delete confirmation modal
  const handleDeleteClick = (ride) => {
    setSelectedRide(ride);
    setShowModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (selectedRide) {
      deleteMutation.mutate(selectedRide.ride_id);
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading rides...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <p>Failed to load rides: {error.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>All Rides</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>From</th>
            <th>To</th>
            <th>Price</th>
            <th>Seats Available</th>
            <th>Travel Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRides.length > 0 ? (
            paginatedRides.map((ride, index) => (
              <tr key={ride.id}>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>{ride.from_place}</td>
                <td>{ride.to_place}</td>
                <td>€{ride.price}</td>
                <td>{ride.no_of_seats_avlb}</td>
                <td>{new Date(ride.travel_date).toLocaleDateString()}</td>
                <td>
                  {role === "admin" ? (
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(ride)}
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => alert(`Booking ride ID: ${ride.id}`)}
                    >
                      Book
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No Rides Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {rides.length > recordsPerPage && (
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

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the ride "{selectedRide?.from_place} →{" "}
          {selectedRide?.to_place}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AllRides;
