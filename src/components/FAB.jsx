import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { AddAPhoto } from '@mui/icons-material';
import ModalComponent from './ModalComponent';
import CreateIcon from '@mui/icons-material/Create';
import CreateStory from './CreateStory';
import CreatePost from './CreatePost';

export default function FAB() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openPostModal, setOpenPostModal] = useState(false);
  const [openStoryModal, setOpenStoryModal] = useState(false);

  const handleOpenPostModal = () => setOpenPostModal(true);
  const handleClosePostModal = () => setOpenPostModal(false);
  
  const handleOpenStoryModal = () => setOpenStoryModal(true);
  const handleCloseStoryModal = () => setOpenStoryModal(false);

  const handleClick = (operation) =>{
    if(operation==="post"){
      handleOpenPostModal()
    }else if(operation==="story"){
      handleOpenStoryModal()
    }
    handleClose();// to close the speed dial, remove this line if not needed.
  };
  const actions = [
    { icon: <AddAPhoto />, name: 'New Post', operation: 'post' },
    { icon: <CreateIcon />, name: 'Add Story', operation: 'story' },
  ];
  return (
    <>
    <Box sx={{position: "fixed", bottom: { xs: -5, md: 20}, left: { xs: -5, md: 30 } }} >
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 20, left: { xs: 20, md: 30} }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
        
            tooltipTitle={action.name}
            onClick={()=>handleClick(action.operation)}
          />
        ))}
      </SpeedDial>
    </Box>
    <ModalComponent open={openPostModal} handleClose={handleClosePostModal} style={{ width: {xs: 350, md: 500}, maxHeight: {xs: 300, md: 400} }}>
      <CreatePost/>
    </ModalComponent>
    <ModalComponent open={openStoryModal} handleClose={handleCloseStoryModal} style={{ width: {xs: 350, md: 500}, maxHeight: {xs: 300, md: 400} }}>
      <CreateStory/>
    </ModalComponent>
    </>
  );
}