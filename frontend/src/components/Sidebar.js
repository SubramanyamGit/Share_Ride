import React, { useMemo } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCar,
  faTasks,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchUserDetails = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/users/my_details`
  );
  return response.data.data;
};

function Sidebar() {
  const location = useLocation();
  const publicRoutes = ["/signin", "/signup"]; // Routes without sidebar

  // const token = useMemo(() => localStorage.getItem("my_token"), []); // Memoize token for consistency

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["my_details"],
  //   queryFn: fetchUserDetails,
  //   enabled: !!token, // Fetch user details only if token exists
  // });

  const userTabs = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Post a Ride", path: "/post-ride", icon: faCar },
    { label: "My Rides", path: "/my-rides", icon: faTasks },
    { label: "My Bookings", path: "/my-bookings", icon: faListAlt }, // New Tab
  ];

  const adminTabs = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Manage Users", path: "/admin/users", icon: faTasks },
    { label: "Manage Rides", path: "/admin/rides", icon: faCar },
  ];
const tabs = localStorage.getItem("role") === 'user' ? userTabs : adminTabs
  // const tabs = useMemo(() => {
  //   if (data) {
  //     return data[0].user_role === "admin" ? adminTabs : userTabs;
  //   }
  //   return [];
  // }, [data]);

  // Check if the current route is a public route
  if (publicRoutes.includes(location.pathname)) {
    return null;
  }

  // if (!token) {
  //   // If no token exists, do not show the sidebar
  //   return null;
  // }

  return (
    <div
      className="bg-primary text-white vh-100"
      style={{ width: "250px", position: "fixed", top: "56px" }}
    >
      <Nav className="flex-column pt-3">
        {tabs.map((tab, index) => (
          <Nav.Link
            as={Link}
            to={tab.path}
            key={index}
            className="text-white py-2 px-3"
          >
            <FontAwesomeIcon icon={tab.icon} className="me-2" />
            {tab.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default Sidebar;