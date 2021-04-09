import React, { useContext, Fragment, useEffect } from "react";
import { useLocation, useHistory, useParams, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
//Context
import UserContext from "../../context/user/userContext";
import PaymentContext from "../../context/payment/paymentContext";
import { monthWords } from "../../utils/dropdowns";

//Components
import { Grid, Paper, Chip, Button, Typography } from "@material-ui/core";
import {
  ThumbUp,
  ThumbDown,
  PauseCircleOutline,
  PlayCircleOutline,
  Pageview,
  Receipt,
} from "@material-ui/icons";
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

const Payments = (props) => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const paymentContext = useContext(PaymentContext);
  const { user, payments } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    loading,
    clearErrors,
    deletePayment,
    approvePayment,
    rejectPayment,
    holdPayment,
    pendingPayment,
    paidPayment,
  } = paymentContext;

  const history = useHistory();

  function MonthWords(i) {
    const arr = monthWords.map((value) => value.value);
    return arr[i - 1];
  }

  // const openEditDialog = (dataIndex) => {
  //   setDialogOpen();
  //   setCurrent(payments[dataIndex]._id);
  //   console.log("Current is set to: ", current);
  // };

  useEffect(() => {
    // if(user.role !== "Admin") history.push("/")
    // if (error) {
    //   enqueueSnackbar(error, {
    //     variant: "error",
    //   });
    //   clearErrors();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payments !== null && payments.length === 0 && !loading) {
    return <h4>You have no payments recorded</h4>; // if user list is empty
  }

  const onClickApprovePayment = (id) => {
    approvePayment(id);
  };

  const onClickRejectPayment = (id) => {
    rejectPayment(id);
  };

  const onClickHoldPayment = (id) => {
    holdPayment(id);
  };

  const onClickPendingPayment = (id) => {
    pendingPayment(id);
  };

  const onClickPaidPayment = (id) => {
    paidPayment(id);
  };

  const viewPayment = (dataIndex) => {
    console.log("user ID is :", dataIndex);
    let path = `/payments/${dataIndex}`;
    history.push(path);
  };

  const editProfile = (e, dataIndex) => {
    userContext.setCurrent(payments[dataIndex]);
    console.log("UserContext SetCurrent set to:", payments[dataIndex]._id);
    let path = `/user/${payments[dataIndex]._id}`;
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
      filename: `payments-${date}.csv`,
    },
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    rowsPerPage: 10,
    draggableColumns: {
      enabled: true,
    },
    selectableRowsHideCheckboxes: false,
    // customToolbar: () => {
    //   return <CustomToolbar />;
    // },
    onRowsDelete: (rows) => {
      console.log("Console log of", rows.data);
      if (rows.data.length <= 10) {
        const paymentsToDelete = rows.data.map((d) => payments[d.dataIndex]);
        paymentsToDelete.forEach((a) => {
          console.log(a);
          if (a.user === user._id) {
            enqueueSnackbar(`You cannot delete your own record`, {
              variant: "error",
            });
            clearErrors();
          } else {
            enqueueSnackbar(`Payment for QUBID ${a.QUBID} deleted`, {
              variant: "success",
            });
            deletePayment(a._id);
          }
        });
      } else {
        paymentContext.loading = true;
        console.log(loading);
        const paymentsToDelete = rows.data.map((d) => payments[d.dataIndex]);
        paymentsToDelete.forEach((a) => {
          if (a._id === user._id) {
            enqueueSnackbar(`You cannot delete your own record`, {
              variant: "error",
            });
            clearErrors();
          } else {
            deletePayment(a._id);
          }
        });
        paymentContext.loading = false;
        console.log(loading);
      }
    },
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
      name: "account",
      label: "Account",
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
        filterList: ["Pending","On Hold"],
        display: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "updatedByUserDate",
      label: "Updated",
      options: {
        filter: true,
        display: false,
        download: true,
        sort: false,
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Grid container direction="row" justify="space-between">
                {tableMeta.rowData[8] === "Rejected" ||
                tableMeta.rowData[8] === "Paid" ? (
                  ""
                ) : tableMeta.rowData[8] === "Pending" ? (
                  <>
                    <Typography color="primary" align="center">
                      <ThumbUp
                        fontSize="small"
                        onClick={() =>
                          onClickApprovePayment(tableMeta.rowData[0])
                        }
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Approve
                      </Typography>
                    </Typography>
                    <Typography color="secondary" align="center">
                      <ThumbDown
                        fontSize="small"
                        onClick={() => {
                          onClickRejectPayment(tableMeta.rowData[0]);
                        }}
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Reject
                      </Typography>
                    </Typography>
                    <Typography color="textSecondary" align="center">
                      <PauseCircleOutline
                        fontSize="small"
                        onClick={() => {
                          onClickHoldPayment(tableMeta.rowData[0]);
                        }}
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Hold
                      </Typography>
                    </Typography>
                  </>
                ) : tableMeta.rowData[8] === "On Hold" ? (
                  <>
                    <Typography color="primary" align="center">
                      <ThumbUp
                        fontSize="small"
                        onClick={() =>
                          onClickApprovePayment(tableMeta.rowData[0])
                        }
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Approve
                      </Typography>
                    </Typography>
                    <Typography color="secondary" align="center">
                      <ThumbDown
                        fontSize="small"
                        onClick={() => {
                          onClickRejectPayment(tableMeta.rowData[0]);
                        }}
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Reject
                      </Typography>
                    </Typography>
                    <Typography color="textSecondary" align="center">
                      <PlayCircleOutline
                        fontSize="small"
                        onClick={() => {
                          onClickPendingPayment(tableMeta.rowData[0]);
                        }}
                      />
                      <Typography
                        align="center"
                        display="block"
                        variant="caption"
                      >
                        Pending
                      </Typography>
                    </Typography>
                  </>
                ) : (
                  <Typography
                    style={{
                      color: "green",
                    }}
                    align="center"
                  >
                    <Receipt
                      fontSize="small"
                      onClick={() => onClickPaidPayment(tableMeta.rowData[0])}
                    />
                    <Typography
                      align="center"
                      display="block"
                      variant="caption"
                    >
                      Paid
                    </Typography>
                  </Typography>
                )}
              </Grid>
            </>
          );
        },
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
          {payments !== null && !loading ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <MUIDataTable
                  title={
                    <div>
                      <Typography variant="h5">User Payments</Typography>
                      <Typography variant="caption">
                        To approve payments individually, please select a row
                      </Typography>
                    </div>
                  }
                  data={payments}
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

export default Payments;
