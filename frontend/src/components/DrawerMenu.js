import React from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCar, faUser, faTasks } from "@fortawesome/free-solid-svg-icons";

function DrawerMenu({ show, onClose, role }) {
  const userTabs = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Post Ride", path: "/post-ride", icon: faCar },
    { label: "My Rides", path: "/my-rides", icon: faTasks },
    { label: "All Rides", path: "/rides", icon: faCar },
  ];

  const adminTabs = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Manage Users", path: "/admin/users", icon: faUser },
    { label: "Manage Rides", path: "/admin/rides", icon: faCar },
  ];

  const tabs = role === "admin" ? adminTabs : userTabs;

  return (
    <Offcanvas show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          {tabs.map((tab, index) => (
            <Nav.Link as={Link} to={tab.path} key={index}>
              <FontAwesomeIcon icon={tab.icon} /> {tab.label}
            </Nav.Link>
          ))}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default DrawerMenu;
