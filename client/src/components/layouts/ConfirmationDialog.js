import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/styles";

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const {
    hideForm,
    stage,
    finalisePayment,
    invoiceTotal,
    RejectAllPayments,
    ApproveAllPayments,
    PaidAllPayments,
  } = props;

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={stage === "SubmitPaymentForm"}
        onClose={hideForm}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirmation Required"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to finalise a payment to the value of £{invoiceTotal}.
          </DialogContentText>
          <DialogContentText>Do you want to continue?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={hideForm} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              finalisePayment();
            }}
            color="primary"
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={
          stage === "RejectAllPayments" ||
          stage === "ApproveAllPayments" ||
          stage === "PaidAllPayments"
        }
        onClose={hideForm}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirmation Required"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to
            {stage === "RejectAllPayments"
              ? " REJECT ALL pending Payments!"
              : stage === "ApproveAllPayments"
              ? " APPROVE ALL pending Payments!"
              : stage === "PaidAllPayments"
              ? " set ALL APPROVED payments to Paid"
              : ""}
          </DialogContentText>
          <DialogContentText>Do you want to continue?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={hideForm} color="primary">
            Cancel
          </Button>
          {stage === "RejectAllPayments" ? (
            <Button
              onClick={() => {
                RejectAllPayments();
              }}
              color="primary"
              autoFocus
            >
              Reject All
            </Button>
          ) : stage === "ApproveAllPayments" ? (
            <Button
              onClick={() => {
                ApproveAllPayments();
              }}
              color="primary"
              autoFocus
            >
              Approve All
            </Button>
          ) : stage === "PaidAllPayments" ? (
            <Button
              onClick={() => {
                PaidAllPayments();
              }}
              color="primary"
              autoFocus
            >
              Set All to Paid
            </Button>
          ) : (
            "Something Went Wrong"
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResponsiveDialog;
