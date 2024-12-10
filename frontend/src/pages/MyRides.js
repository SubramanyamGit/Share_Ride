import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Container,
  Modal,
  Alert,
  Form,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

// Fetch My Rides API
const fetchMyRides = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/rides/my_rides`
  );
  return response.data.data;
};

// Update Ride API
const updateRide = async ({ ride_id, data }) => {
  const response = await axiosInstanceWithToken.patch(
    `${process.env.REACT_APP_API_URL}/rides`,
    {ride_id,...data}
  );
  return response.data;
};

// Delete Ride API
const deleteRide = async (ride_id) => {
  const response = await axiosInstanceWithToken.delete(
    `${process.env.REACT_APP_API_URL}/rides/${ride_id}`
  );
  return response.data;
};

function MyRides() {
  const queryClient = useQueryClient();

  // State for modals and loader
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [formValues, setFormValues] = useState({
    pick_up_location: "",
    drop_location: "",
    no_of_seats_avlb: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch Rides
  const {
    data: rides = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myRides"],
    queryFn: fetchMyRides,
  });

  // Pagination logic
  const totalPages = Math.ceil(rides.length / recordsPerPage);
  const paginatedRides = rides.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Update Ride Mutation
  const updateMutation = useMutation({
    mutationFn: updateRide,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries(["myRides"]);
      setEditModal(false);
      setLoading(false);
      toast.success("Ride modified successfully!", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(`Failed to modify ride: ${error.message}`, {
        position: "top-center",
      });
      setLoading(false);
    },
  });

  // Delete Ride Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRide,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries(["myRides"]);
      setDeleteModal(false);
      setLoading(false);
      toast.success("Ride deleted successfully!", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(`Failed to delete ride: ${error.message}`, {
        position: "top-center",
      });
      setLoading(false);
    },
  });

  // Open Edit Modal
  const handleEdit = (ride) => {
    setSelectedRide(ride);
    setFormValues({
      pick_up_location: ride.pick_up_location,
      drop_location: ride.drop_location,
      no_of_seats_avlb: ride.no_of_seats_avlb,
    });
    setIsModified(false);
    setEditModal(true);
  };

  // Open Delete Modal
  const handleDelete = (ride) => {
    setSelectedRide(ride);
    setDeleteModal(true);
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Check for modifications
  useEffect(() => {
    if (
      selectedRide &&
      (formValues.pick_up_location !== selectedRide.pick_up_location ||
        formValues.drop_location !== selectedRide.drop_location ||
        formValues.no_of_seats_avlb !== selectedRide.no_of_seats_avlb)
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [formValues, selectedRide]);

  // Handle Update Submit
  const handleModify = () => {
    updateMutation.mutate({ ride_id: selectedRide.ride_id, data: formValues });
  };

  // Handle Delete Confirm
  const handleConfirmDelete = () => {
    deleteMutation.mutate(selectedRide.ride_id);
  };

  return (
    <Container className="mt-4 position-relative">
      <h2>My Rides</h2>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading your rides...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          <p>Failed to load your rides: {error.message}</p>
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>From</th>
            <th>To</th>
            <th>Pick-Up Location</th>
            <th>Drop Location</th>
            <th>Price (€)</th>
            <th>Seats Available</th>
            <th>Car Type</th>
            <th>Travel Date</th>
            <th>Travel Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRides.length > 0 ? (
            paginatedRides.map((ride, index) => (
              <tr key={ride.ride_id}>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>{ride.from_place}</td>
                <td>{ride.to_place}</td>
                <td>{ride.pick_up_location}</td>
                <td>{ride.drop_location}</td>
                <td>€{ride.price}</td>
                <td>{ride.no_of_seats_avlb}</td>
                <td>{ride.car_type}</td>
                <td>{new Date(ride.travel_date).toLocaleDateString()}</td>
                <td>{ride.travel_time}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(ride)}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(ride)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No Data Found
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

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pick-Up Location</Form.Label>
              <Form.Control
                type="text"
                name="pick_up_location"
                value={formValues.pick_up_location}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Drop Location</Form.Label>
              <Form.Control
                type="text"
                name="drop_location"
                value={formValues.drop_location}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seats Available</Form.Label>
              <Form.Control
                type="number"
                name="no_of_seats_avlb"
                value={formValues.no_of_seats_avlb}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleModify}
            disabled={!isModified || updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Modifying..." : "Modify"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this ride?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyRides;
