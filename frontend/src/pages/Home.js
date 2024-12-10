import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container, Row, Col, Spinner, Alert, Form, Button } from "react-bootstrap";
import RideCard from "../components/RideCard";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

// Fetch rides function
const fetchRides = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/rides`
  );
  return response.data.data;
};

function Home() {
  const [filters, setFilters] = useState({
    from_place: "",
    to_place: "",
    date: "",
    max_price: "",
  });

  const { data: rides = [], isLoading, error } = useQuery({
    queryKey: ["rides"],
    queryFn: fetchRides,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredRides = rides.filter((ride) => {
    const rideDate = new Date(ride.travel_date).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    return (
      (!filters.from_place || ride.from_place.toLowerCase().includes(filters.from_place.toLowerCase())) &&
      (!filters.to_place || ride.to_place.toLowerCase().includes(filters.to_place.toLowerCase())) &&
      (!filters.date || rideDate === filters.date) &&
      (!filters.max_price || ride.price <= parseFloat(filters.max_price))
    );
  });

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
          <p>Error loading rides: {error.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Available Rides</h2>

      {/* Filters Section */}
      <Form className="mb-4">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>From Place</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter starting point"
                name="from_place"
                value={filters.from_place}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>To Place</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter destination"
                name="to_place"
                value={filters.to_place}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Max Price (€)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max price"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button
              variant="secondary"
              onClick={() => setFilters({ from_place: "", to_place: "", date: "", max_price: "" })}
            >
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Rides Section */}
      <Row>
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <Col md={4} key={ride.id} className="mb-4">
              <RideCard ride={ride} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="text-center">
              No rides match the current filters.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Home;
