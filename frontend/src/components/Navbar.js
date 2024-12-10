import React, { useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function AppNavbar() {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const publicRoutes = ["/signin", "/signup"];

  if (publicRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    // Clear token or user data
    localStorage.removeItem("my_token");
    window.location.href = "/signin";
  };

  return (
    <Navbar
      expand="lg"
      bg="primary"
      variant="dark"
      className="shadow-sm sticky-top"
    >
      <Container fluid>
        {/* Brand Name */}
        <Navbar.Brand href="/" className="fw-bold text-white">
          Share Ride
        </Navbar.Brand>

        {/* Profile Icon */}
        <div className="position-relative">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            color="white"
            style={{ cursor: "pointer" }}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div
              className="position-absolute bg-white shadow rounded py-2"
              style={{
                top: "40px",
                right: "0",
                width: "150px",
                zIndex: "1050",
              }}
            >
              <div
                className="px-3 py-2 text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = "/profile")}
              >
                Profile
              </div>
              <div
                className="px-3 py-2 text-dark"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
