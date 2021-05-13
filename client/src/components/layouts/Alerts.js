import React, { useContext } from "react";
import AlertContext from "../../context/alert/alertContext";
//Components
import { useSnackbar } from "notistack";

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <>
    {alertContext.alerts.length > 0 &&
    alertContext.alerts.map((alert) => (
      enqueueSnackbar(`${alert.msg}`, {
        variant: `${alert.type}`,
      })
    ))}
    </>
  );
  
};

export default Alerts;
