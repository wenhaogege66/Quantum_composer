import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface GateInfoModalProps {
  open: boolean;
  gateInfo: {
    gateType: string;
    [key: string]: any;
  } | null;
  onClose: () => void;
}

const GateInfoModal = ({ open, gateInfo, onClose }: GateInfoModalProps) => {
  let content;
  switch (gateInfo?.gateType) {
    case "H":
      content = "This is a Hadamard gate.";
      break;
    // 可以在这里添加其他门的介绍
    default:
      content = "No information available for this gate.";
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" id="modal-modal-title">
          Gate Information
        </Typography>
        <Typography variant="body2" id="modal-modal-description">
          {content}
        </Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default GateInfoModal;
