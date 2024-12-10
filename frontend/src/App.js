import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PostRide from "./pages/PostRide";
import MyRides from "./pages/MyRides";
import AdminUsers from "./pages/AdminUsers";
import AllRides from "./pages/AllRides";
import MyBookings from "./pages/MyBookings";
import SecureRoute from "./components/SecureRoute";

function App() {

  return (
    <Router>
      <AppNavbar />
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar  />

        {/* Main Content Area */}
        <div
          className="flex-grow-1"
          style={{
            marginLeft: "250px", // Adjust based on sidebar width
            padding: "20px", // Add some padding for better readability
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Secure Routes */}
            <Route
              path="/"
              element={
                <SecureRoute>
                  <Home />
                </SecureRoute>
              }
            />
            <Route
              path="/post-ride"
              element={
                <SecureRoute>
                  <PostRide />
                </SecureRoute>
              }
            />
            <Route
              path="/my-rides"
              element={
                <SecureRoute>
                  <MyRides />
                </SecureRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <SecureRoute>
                  <AdminUsers />
                </SecureRoute>
              }
            />
            <Route
              path="/admin/rides"
              element={
                <SecureRoute>
                  <AllRides role="admin" />
                </SecureRoute>
              }
            />
            <Route
              path="/rides"
              element={
                <SecureRoute>
                  <AllRides role="user" />
                </SecureRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <SecureRoute>
                  <MyBookings />
                </SecureRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
