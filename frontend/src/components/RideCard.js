import React, { useState } from "react";
import { Card, Button, Modal, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faEuroSign,
  faMapMarkerAlt,
  faClock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

const createBooking = async (booking) => {
  const response = await axiosInstanceWithToken.post(
    `${process.env.REACT_APP_API_URL}/bookings`,
    booking
  );
  return response.data;
};


function RideCard({ ride }) {
  const [showModal, setShowModal] = useState(false);

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Ride booked successfully!", { position: "top-center" });
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to book ride: ${error.message}`, {
        position: "top-center",
      });
    },
  });

  const BookingSchema = Yup.object().shape({
    full_name: Yup.string().required("Full Name is required"),
    mobile_no: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
      .required("Mobile number is required"),
    no_of_seats: Yup.number()
      .min(1, "At least 1 seat must be booked")
      .max(ride.no_of_seats_avlb, `Cannot book more than ${ride.no_of_seats_avlb} seats`)
      .required("Number of seats is required"),
    payment_method: Yup.string()
      .oneOf(["cash", "online"], "Select a valid payment method")
      .required("Payment method is required"),
    booking_message: Yup.string().max(250, "Message cannot exceed 250 characters"),
  });

  const handleConfirm = (values) => {
    const formattedDate = new Date(ride.travel_date).toISOString().split("T")[0];
    mutation.mutate({
      ...values,
      ride_id: ride.ride_id,
      booked_time: new Date().toISOString(),
      from_place: ride.from_place, 
      to_place: ride.to_place,
      travel_date: formattedDate, 
      travel_time: ride.travel_time, 
    });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faCarSide} className="me-2" />
              <strong>Route:</strong>
            </Col>
            <Col xs={8}>{ride.from_place} → {ride.to_place}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
              <strong>Pick-Up:</strong>
            </Col>
            <Col xs={8}>{ride.pick_up_location}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
              <strong>Drop-Off:</strong>
            </Col>
            <Col xs={8}>{ride.drop_location}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faClock} className="me-2" />
              <strong>Date & Time:</strong>
            </Col>
            <Col xs={8}>
              {new Date(ride.travel_date).toLocaleDateString()} at {ride.travel_time}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faEuroSign} className="me-2" />
              <strong>Price:</strong>
            </Col>
            <Col xs={8}>€{ride.price}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <strong>Seats Available:</strong>
            </Col>
            <Col xs={8}>{ride.no_of_seats_avlb}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <strong>Car Type:</strong>
            </Col>
            <Col xs={8}>{ride.car_type}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="text-secondary">
              <FontAwesomeIcon icon={faPhone} className="me-2" />
              <strong>Contact:</strong>
            </Col>
            <Col xs={8}>{ride.mobile_no}</Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Book Ride
          </Button>
        </Card.Footer>
      </Card>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Book Ride</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            full_name: "",
            mobile_no: "",
            no_of_seats: "",
            payment_method: "",
            payment_status: "Success", // Defaulted based on payment method
            booking_message: "",
          }}
          validationSchema={BookingSchema}
          onSubmit={handleConfirm}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="p-3">
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <Field
                    type="text"
                    name="full_name"
                    className="form-control"
                  />
                  <ErrorMessage name="full_name" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <Field
                    type="text"
                    name="mobile_no"
                    className="form-control"
                  />
                  <ErrorMessage name="mobile_no" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Seats</label>
                  <Field
                    type="number"
                    name="no_of_seats"
                    className="form-control"
                    max={ride.no_of_seats_avlb}
                  />
                  <ErrorMessage name="no_of_seats" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <Field
                    as="select"
                    name="payment_method"
                    className="form-select"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("payment_status", e.target.value ? "Success" : "Pending");
                    }}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </Field>
                  <ErrorMessage name="payment_method" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <Field
                    type="text"
                    name="payment_status"
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Booking Message</label>
                  <Field
                    as="textarea"
                    name="booking_message"
                    className="form-control"
                  />
                  <ErrorMessage name="booking_message" component="div" className="text-danger" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={mutation.isLoading}>
                  {mutation.isLoading ? "Booking..." : "Confirm"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default RideCard;
