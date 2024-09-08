// ReportProblemModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReportProblemModal.css";
import cardToBeeLogo from "../../../public/assets/cardtobee_logo.png";

function ReportProblemModal({ show, handleClose }) {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !email) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Your problem has been submitted. Thank you!");
      setLoading(false);
      handleClose();
    }, 1000);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="report-problem-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          <img
            src={cardToBeeLogo}
            alt="CardToBee Logo"
            className="cardtobee-logo"
          />
          Report a Problem
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Problem Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the issue you're facing"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="bee-btn"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ReportProblemModal;
