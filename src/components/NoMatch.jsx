import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

const NoMatch = () => {
  return (
    <Alert severity="error">
        <AlertTitle>Error [404]</AlertTitle>
        Page Not Found.
    </Alert>
  )
}

export default NoMatch