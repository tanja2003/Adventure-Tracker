import React from "react";
import { Modal } from "react-bootstrap";

export default function LightboxModal({ src, onClose }) {
  if (!src) return null;

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Body style={{ padding: 0 }}>
        <img
          src={src}
          alt="Zoomed"
          style={{ width: "100%", height: "auto" }}
          onClick={onClose}
        />
      </Modal.Body>
    </Modal>
  );
}
