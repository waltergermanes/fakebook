import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function ModalComponent({ children, open, handleClose, style }) {
  const styles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: style.width,
    height: style.height,
    bgcolor: 'background.default',
    color: "text.primary",
    boxShadow: 24,
  
  };
  return (
    <div>
       <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
        <Box sx={styles}>
          { children }
        </Box>
      </Modal>
    </div>
  );
}
