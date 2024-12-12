import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

const isTimeValid = (travelDate, travelTime) => {
  const currentDate = new Date();
  const selectedDate = new Date(travelDate);
  const selectedTime = new Date(`${travelDate}T${travelTime}`);

  if (selectedDate.toDateString() === currentDate.toDateString()) {
    return selectedTime > currentDate;
  }
  return true;
};

const createRide = async (ride) => {
  const response = await axiosInstanceWithToken.post(
    `${process.env.REACT_APP_API_URL}/rides`,
    ride
  );
  return response.data;
};

const PostRideSchema = Yup.object().shape({
  from_place: Yup.string().required("From place is required"),
  to_place: Yup.string().required("To place is required"),
  price: Yup.number()
    .min(1, "Price must be at least €1")
    .required("Price is required"),
  no_of_seats_avlb: Yup.number()
    .min(1, "At least one seat is required")
    .max(10, "Maximum 10 seats allowed")
    .required("Number of seats is required"),
  travel_date: Yup.date()
    .min(new Date().toISOString().split("T")[0], "Travel date cannot be in the past")
    .required("Travel date is required"),
  travel_time: Yup.string()
    .test("is-valid-time", "Travel time cannot be in the past", function (value) {
      const { travel_date } = this.parent;
      return isTimeValid(travel_date, value);
    })
    .required("Travel time is required"),
  mobile_no: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  pick_up_location: Yup.string().required("Pick-up location is required"),
  drop_location: Yup.string().required("Drop location is required"),
  car_type: Yup.string()
    .oneOf(["small", "medium", "large"], "Invalid car type")
    .required("Car type is required"),
});

function PostRide() {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: createRide,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      toast.success("Ride posted successfully!", { position: "top-center" });
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Failed to post ride: ${error.message}`, { position: "top-center" });
      setLoading(false);
    },
  });

  const handleSubmit = (values, { resetForm }) => {
    mutation.mutate(values);
    resetForm();
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Post Ride</h2>
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
      <Formik
        initialValues={{
          from_place: "",
          to_place: "",
          price: "",
          no_of_seats_avlb: "",
          travel_date: "",
          travel_time: "",
          mobile_no: "",
          pick_up_location: "",
          drop_location: "",
          car_type: "",
        }}
        validationSchema={PostRideSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">From Place</label>
                <Field
                  name="from_place"
                  type="text"
                  className={`form-control ${errors.from_place && touched.from_place ? "is-invalid" : ""}`}
                />
                {errors.from_place && touched.from_place && (
                  <div className="invalid-feedback">{errors.from_place}</div>
                )}
              </Col>
              <Col md={6}>
                <label className="form-label">To Place</label>
                <Field
                  name="to_place"
                  type="text"
                  className={`form-control ${errors.to_place && touched.to_place ? "is-invalid" : ""}`}
                />
                {errors.to_place && touched.to_place && (
                  <div className="invalid-feedback">{errors.to_place}</div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Price (€)</label>
                <Field
                  name="price"
                  type="number"
                  className={`form-control ${errors.price && touched.price ? "is-invalid" : ""}`}
                />
                {errors.price && touched.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </Col>
              <Col md={6}>
                <label className="form-label">Seats Available</label>
                <Field
                  name="no_of_seats_avlb"
                  type="number"
                  className={`form-control ${errors.no_of_seats_avlb && touched.no_of_seats_avlb ? "is-invalid" : ""}`}
                />
                {errors.no_of_seats_avlb && touched.no_of_seats_avlb && (
                  <div className="invalid-feedback">{errors.no_of_seats_avlb}</div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Travel Date</label>
                <Field
                  name="travel_date"
                  type="date"
                  className={`form-control ${errors.travel_date && touched.travel_date ? "is-invalid" : ""}`}
                />
                {errors.travel_date && touched.travel_date && (
                  <div className="invalid-feedback">{errors.travel_date}</div>
                )}
              </Col>
              <Col md={6}>
                <label className="form-label">Travel Time</label>
                <Field
                  name="travel_time"
                  type="time"
                  className={`form-control ${errors.travel_time && touched.travel_time ? "is-invalid" : ""}`}
                />
                {errors.travel_time && touched.travel_time && (
                  <div className="invalid-feedback">{errors.travel_time}</div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Mobile Number</label>
                <Field
                  name="mobile_no"
                  type="text"
                  className={`form-control ${errors.mobile_no && touched.mobile_no ? "is-invalid" : ""}`}
                />
                {errors.mobile_no && touched.mobile_no && (
                  <div className="invalid-feedback">{errors.mobile_no}</div>
                )}
              </Col>
              <Col md={6}>
                <label className="form-label">Car Type</label>
                <Field
                  as="select"
                  name="car_type"
                  className={`form-control ${errors.car_type && touched.car_type ? "is-invalid" : ""}`}
                >
                  <option value="">Select Car Type</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Field>
                {errors.car_type && touched.car_type && (
                  <div className="invalid-feedback">{errors.car_type}</div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Pick-Up Location</label>
                <Field
                  name="pick_up_location"
                  type="text"
                  className={`form-control ${errors.pick_up_location && touched.pick_up_location ? "is-invalid" : ""}`}
                />
                {errors.pick_up_location && touched.pick_up_location && (
                  <div className="invalid-feedback">{errors.pick_up_location}</div>
                )}
              </Col>
              <Col md={6}>
                <label className="form-label">Drop Location</label>
                <Field
                  name="drop_location"
                  type="text"
                  className={`form-control ${errors.drop_location && touched.drop_location ? "is-invalid" : ""}`}
                />
                {errors.drop_location && touched.drop_location && (
                  <div className="invalid-feedback">{errors.drop_location}</div>
                )}
              </Col>
            </Row>

            <div className="text-end">
              <Button type="submit" variant="primary" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Posting..." : "Post Ride"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default PostRide;
