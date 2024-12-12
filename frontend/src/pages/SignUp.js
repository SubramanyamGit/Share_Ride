import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../hooks/axiosInstance";
import { toast } from "react-toastify";

const SignUpSchema = Yup.object().shape({
  full_name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter, one number, one special character, and be at least 6 characters long"
    )
    .required("Password is required"),
});

const signUpUser = async (values) => {
  const response = await axiosInstance.post(
    `${process.env.REACT_APP_API_URL}/sign_up`,
    JSON.stringify({ ...values, user_role: "user" })
  );
  return response.data;
};

function SignUpPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("SignUp successful! Please log in.");
      navigate("/signin");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="vh-100 d-flex">
      <div className="col-md-6 d-none d-md-block">
        <img
          src="https://res.cloudinary.com/dvduw2l98/image/upload/fl_preserve_transparency/v1733625832/share_ride_lgbmqq.jpg?_s=public-apps" 
          alt="Share Ride"
          className="img-fluid h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="col-md-6 d-flex align-items-center justify-content-center">
        <div className="card shadow-lg p-4 w-75">
          <h2 className="text-center mb-4">Sign Up</h2>
          <Formik
            initialValues={{ full_name: "", email: "", password: "" }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">
                    Full Name
                  </label>
                  <Field
                    id="full_name"
                    name="full_name"
                    type="text"
                    className={`form-control ${
                      errors.full_name && touched.full_name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.full_name && touched.full_name && (
                    <div className="invalid-feedback">{errors.full_name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${
                      errors.email && touched.email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.email && touched.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${
                      errors.password && touched.password ? "is-invalid" : ""
                    }`}
                  />
                  {errors.password && touched.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
