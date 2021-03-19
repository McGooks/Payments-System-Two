import React, { useContext, Fragment, useEffect } from "react";
import { useLocation, useHistory, useParams, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
//Context
import UserContext from "../../context/user/userContext";
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";

//Components
import { Grid, Paper, Chip, Button, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/Person";
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

const Payments = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const paymentContext = useContext(PaymentContext);
  const { user, loadUser } = authContext;
  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    payments,
    getPayments,
    loading,
    error,
    clearErrors,
    setDialogOpen,
    setCurrent,
    deletePayment,
  } = paymentContext;

  const history = useHistory();

  // const openEditDialog = (dataIndex) => {
  //   setDialogOpen();
  //   setCurrent(payments[dataIndex]._id);
  //   console.log("Current is set to: ", current);
  // };

  useEffect(() => {
    getPayments();
    console.log("console log, user payments ", payments);
    // if(user.role !== "Admin") history.push("/")
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payments !== null && payments.length === 0 && !loading) {
    return <h4>You have no payments recorded</h4>; // if user list is empty
  }

  const openDialog = (e, dataIndex) => {
    e.preventDefault();
    setDialogOpen();
    setCurrent(payments[dataIndex]._id);
    console.log("Handled Click", setCurrent(payments[dataIndex]));
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
      filename: "userAdminDownload.csv",
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
      console.log("Console log of", rows.data.length);
      if (rows.data.length <= 10) {
        const paymentsToDelete = rows.data.map((d) => payments[d.dataIndex]);
        paymentsToDelete.forEach((a) => {
          if (a._id === user._id) {
            enqueueSnackbar(`You cannot delete your own record`, {
              variant: "error",
            });
            clearErrors();
          } else {
            enqueueSnackbar(
              `User ${a.firstName} ${a.lastName} (${a.QUBID}) deleted`,
              {
                variant: "success",
              }
            );
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
        download: false,
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
        customBodyRenderLite: (dataIndex) => {
          return (
            <EditIcon
              onClick={(e) => {
                openDialog(e, dataIndex);
              }}
            />
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
        customBodyRenderLite: (dataIndex) => {
          return (
            <PersonIcon
              onClick={(e) => {
                editProfile(e, dataIndex);
              }}
            />
          );
        },
      },
    },
    // {
    //   name: "Add",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     empty: true,
    //     customBodyRenderLite: (dataIndex) => {
    //       return (
    //         <button
    //           onClick={() => {
    //             const { data } = this.state;
    //             data.unshift([
    //               "Mason Ray",
    //               "Computer Scientist",
    //               "San Francisco",
    //               39,
    //               "$142,000",
    //             ]);
    //             this.setState({ data });
    //           }}
    //         >
    //           Add
    //         </button>
    //       );
    //     },
    //   },
    // },
  ];

  return (
    <Fragment>
      <div>
        <div>
          {payments !== null && !loading ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={6}
                      className={clsx(classes.root, classes.left)}
                    >
                      <Button variant="contained" color="secondary">
                        Reject All Pending
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      className={clsx(classes.root, classes.right)}
                    >
                      <Button variant="contained" component={Link} to="/payments/new"color="success">
                        Add Payment
                      </Button>
                      <Button variant="contained" color="primary">
                        Approve All Pending
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
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
