import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance, axiosInstanceWithToken } from "../hooks/axiosInstance";
import { toast } from "react-toastify";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const signInUser = async (values) => {
  const response = await axiosInstance.post(
    `${process.env.REACT_APP_API_URL}/sign_in`,
    values
  );
  return response.data;
};

function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: signInUser,
    onSuccess: (data) => {
      localStorage.setItem("my_token", data.data.token);
      localStorage.setItem("role", data.data.user_role);

      axiosInstanceWithToken.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.token}`;
      queryClient.invalidateQueries(["my_details"]);
      toast.success("SignIn successful");
      navigate("/");
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
      <div className="col-6 d-none d-md-block">
        <img
          src="https://res.cloudinary.com/dvduw2l98/image/upload/fl_preserve_transparency/v1733625832/share_ride_lgbmqq.jpg?_s=public-apps"
          alt="Share Ride"
          className="img-fluid h-100 w-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="col-6 d-flex align-items-center justify-content-center">
        <div className="w-75 p-4 shadow rounded">
          <h2 className="text-center mb-4">Sign In</h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SignInSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
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
                  {mutation.isLoading ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-center mt-3">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
