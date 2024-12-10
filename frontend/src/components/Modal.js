import React from "react";
import { Modal, Button } from "react-bootstrap";

function MessageModal({ show, onClose, title, message, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {onConfirm && (
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default MessageModal;
