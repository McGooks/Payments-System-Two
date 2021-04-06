import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { hideForm, stage, finalisePayment, invoiceTotal } = props

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={stage === "SubmitPaymentForm"}
        onClose={hideForm}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Confirmation Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to finalise a payment to the value of £{invoiceTotal}.
          </DialogContentText>
          <DialogContentText>
            Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={hideForm} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { finalisePayment() }} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ResponsiveDialog