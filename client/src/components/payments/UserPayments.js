import React, { useContext, Fragment, useEffect } from "react";
import { useLocation, useHistory, useParams, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
//Context
import UserContext from "../../context/user/userContext";
import PaymentContext from "../../context/payment/paymentContext";
import { monthWords } from "../../utils/dropdowns";

//Components
import { Grid, Paper, Chip, Button, Typography } from "@material-ui/core";
import { ThumbUp, ThumbDown, Pause, Pageview } from "@material-ui/icons";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
import clsx from "clsx";
// import CustomToolbar from "../layouts/CustomToolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "right",
    color: theme.palette.text.secondary,
  },
  right: {
    textAlign: "right",
  },
  left: {
    textAlign: "left",
  },
}));

const date = new Date().toUTCString();

const UserPayments = (props) => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const { user, userPayments, userPaymentsLoading } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();

  const history = useHistory();

  function MonthWords(i) {
    const arr = monthWords.map((value) => value.value);
    return arr[i - 1];
  }

  if (userPayments !== null && !userPayments.length && !userPaymentsLoading) {
    return <h4>You have no userPayments recorded</h4>; // if user list is empty
  }

  const viewPayment = (dataIndex) => {
    let path = `/payments/${dataIndex}`;
    history.push(path);
  };


  const CustomChip = ({ label, onDelete }) => {
    return (
      <Chip
        variant="outlined"
        color="primary"
        label={label}
        onDelete={onDelete}
      />
    );
  };

  const CustomFilterList = (props) => {
    return <TableFilterList {...props} ItemComponent={CustomChip} />;
  };

  const options = {
    filter: true,
    filterType: "dropdown",
    sortOrder: {
      name: "paymentPeriodNum",
      direction: "asc",
    },
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: false,
        useDisplayedRowsOnly: true,
      },
      filename: `${user.QUBID}Payments-${date}.csv`,
    },
    selectableRowsHideCheckboxes: false,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    rowsPerPage: 10,
    draggableColumns: {
      enabled: false,
    },
    selectableRowsHideCheckboxes: true,
    // customToolbar: () => {
    //   return <CustomToolbar />;
    // },
  };

  const columns = [
    {
      name: "_id",
      label: "UserId",
      options: {
        filter: false,
        display: false,
        download: false,
        sort: false,
      },
    },
    {
      name: "paymentPeriodNum",
      label: "Month",
      options: {
        filter: false,
        display: false,
        download: true,
        sort: true,
      },
    },
    {
      name: "paymentPeriod",
      label: "Month",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
        customBodyRender: (value) => {
          return MonthWords(value);
        },
      },
    },
    {
      name: "QUBID",
      label: "QUBID",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
      },
    },
    {
      name: "academicYear",
      label: "Year",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
      },
    },
    {
      name: "deliveredBy",
      label: "Role",
      options: {
        filter: true,
        display: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        display: true,
        download: true,
        sort: false,
        customBodyRender: (value) => {
          return `£${value}`;
        },
      },
    },
    {
      name: "paymentStatus",
      label: "Status",
      options: {
        filter: true,
        display: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Grid
                container
                direction="row"
                alignContent="center"
                alignItems="center"
              >
                <Typography align="center">
                <Pageview
                    fontSize="small"
                    onClick={() => viewPayment(tableMeta.rowData[0])}
                    userID={tableMeta.rowData[0]}
                  />
                  <Typography align="center" display="block" variant="caption">
                    View
                  </Typography>
                </Typography>
              </Grid>
            </>
          );
        },
      },
    },
  ];

  return (
    <Fragment>
      <div>
        <div>
          {userPayments !== null && !userPaymentsLoading ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <MUIDataTable
                  title={
                    <div>
                      <Typography variant="h5">My Payments</Typography>
                    </div>
                  }
                  data={userPayments}
                  columns={columns}
                  options={options}
                  components={{
                    TableFilterList: CustomFilterList,
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <ProgressIndicator />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UserPayments;
