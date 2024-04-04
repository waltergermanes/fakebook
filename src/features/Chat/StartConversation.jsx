import { CardContent, Stack, Button } from '@mui/material'
import React from 'react'
import ModalComponent from '../../components/ModalComponent'
import NewConvo from './NewConvo';
import { useOutletContext } from 'react-router';

const StartConversation = () => {
  const [ conversation, socket ] = useOutletContext()
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Stack flex={{ xs: 5, md: 3 }}>
        <CardContent sx={{ height: 440, display: `grid`, placeContent: `center` }} >
            <Button onClick={handleOpenModal} variant="contained" color="primary">
              Start Conversation
            </Button>
       </CardContent>
        <ModalComponent open={openModal} handleClose={handleCloseModal} style={{ width: 530, maxHeight: 400 }}>
          <NewConvo conversation={conversation}/>
        </ModalComponent>
    </Stack>
  )
}

export default StartConversation