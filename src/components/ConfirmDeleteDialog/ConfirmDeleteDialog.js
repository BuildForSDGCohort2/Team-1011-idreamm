import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function FormDialog({ open, onClose }) {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button onClick={() => onClose(true)} color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
