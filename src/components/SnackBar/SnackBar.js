import React, { useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import { SnackContext } from '../../context/SnackContext';

export default function SnackBar() {
  const [snack, setSnack] = useContext(SnackContext);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={snack.open}
      autoHideDuration={5000}
      onClose={() => setSnack({ open: false, message: '' })}
      message={snack.message}
      style={{ width: 'fit-content', maxWidth: '90vw' }}
    />
  );
}
