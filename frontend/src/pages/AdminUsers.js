import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  Pagination,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { Field, Formik, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { axiosInstanceWithToken } from "../hooks/axiosInstance";

const roleMapObj = {
  admin: "Admin",
  user: "User",
};

// Fetch Users API
const fetchUsers = async () => {
  const response = await axiosInstanceWithToken.get(
    `${process.env.REACT_APP_API_URL}/users`
  );
  return response.data.data;
};

// Update User Status API
const updateUserStatus = async ({ userId, newStatus }) => {
  const response = await axiosInstanceWithToken.patch(
    `${process.env.REACT_APP_API_URL}/users`,
    { user_id: userId, user_status: newStatus }
  );
  return response.data;
};

// Create User API
const createUser = async (userData) => {
  const response = await axiosInstanceWithToken.post(
    `${process.env.REACT_APP_API_URL}/users`,
    userData
  );
  return response.data.data;
};

function AdminUsers() {
  const queryClient = useQueryClient();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch Users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Paginate users
  const totalPages = Math.ceil(users.length / recordsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Mutation for updating user status
  const updateStatusMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      toast.success("User status updated successfully!", {
        position: "top-center",
      });
      queryClient.invalidateQueries(["users"]);
      setShowStatusModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to update user status: ${error.message}`, {
        position: "top-center",
      });
    },
  });

  // Mutation for creating a user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!", { position: "top-center" });
      queryClient.invalidateQueries(["users"]);
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.response.data.message}`, {
        position: "top-center",
      });
    },
  });

  // Open the status change confirmation modal
  const handleStatusChange = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  // Confirm status change
  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      const newStatus =
        selectedUser.user_status === "active" ? "inactive" : "active";
      updateStatusMutation.mutate({ userId: selectedUser.user_id, newStatus });
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading users...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <p>Failed to load users: {error.message}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Users</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create User
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{roleMapObj[user.user_role]}</td>
                <td>{user.user_status === "active" ? "Active" : "Inactive"}</td>
                <td>
                  <Button
                    variant={
                      user.user_status === "active" ? "danger" : "success"
                    }
                    size="sm"
                    onClick={() => handleStatusChange(user)}
                  >
                    {user.user_status === "active" ? "Inactive" : "Active"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {users.length > recordsPerPage && (
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

      {/* Status Change Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change User Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status of user{" "}
          <strong>{selectedUser?.full_name}</strong> to{" "}
          <strong>
            {selectedUser?.user_status === "active" ? "Inactive" : "Active"}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmStatusChange}
            disabled={updateStatusMutation.isLoading}
          >
            {updateStatusMutation.isLoading ? "Updating..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            full_name: "",
            email: "",
            user_role: "",
            password: "",
          }}
          validationSchema={Yup.object().shape({
            full_name: Yup.string().required("Full name is required"),
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            user_role: Yup.string()
              .oneOf(["admin", "user"], "Invalid role")
              .required("User role is required"),
              password: Yup.string()
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                "Password must contain at least one letter, one number, one special character, and be at least 6 characters long"
              )
              .required("Password is required"),
          })}
          onSubmit={(values) => {
            createUserMutation.mutate(values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form noValidate>
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <Field
                    name="full_name"
                    type="text"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <Field as="select" name="user_role" className="form-control">
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Field>
                  <ErrorMessage
                    name="user_role"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || createUserMutation.isLoading}
                >
                  {createUserMutation.isLoading ? "Creating..." : "Create"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Container>
  );
}

export default AdminUsers;
