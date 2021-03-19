import React, { useContext, Fragment, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
//Context
import UserContext from "../../context/user/userContext";
import AuthContext from "../../context/auth/authContext";
import PaymentContext from "../../context/payment/paymentContext";

//Components
import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/Person";
import Chip from "@material-ui/core/Chip";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
// import CustomToolbar from "../layouts/CustomToolbar";

const UserAdmin = () => {
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const paymentContext = useContext(PaymentContext);
  const { user, loadUser } = authContext;
  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    userPayments,
    getUserPayments,
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
  //   setCurrent(userPayments[dataIndex]._id);
  //   console.log("Current is set to: ", current);
  // };

  useEffect(() => {
    getUserPayments(id);
    console.log("console log, user payments ", userPayments);
    // if(user.role !== "Admin") history.push("/")
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userPayments !== null && userPayments.length === 0 && !loading) {
    return <h4>You have no payments recorded</h4>; // if user list is empty
  }

  // const openDialog = (e, dataIndex) => {
  //   e.preventDefault();
  //   setDialogOpen();
  //   setCurrent(userPayments[dataIndex]._id);
  //   console.log("Handled Click", setCurrent(userPayments[dataIndex]));
  // };

  // const editProfile = (e, dataIndex) => {
  //   userContext.setCurrent(userPayments[dataIndex]);
  //   console.log("UserContext SetCurrent set to:", userPayments[dataIndex]._id);
  //   let path = `/user/${userPayments[dataIndex]._id}`;
  //   history.push(path);
  // };

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
    selectableRowsHideCheckboxes: true,
    // customToolbar: () => {
    //   return <CustomToolbar />;
    // },
    // onRowsDelete: (rows) => {
    //   console.log("Console log of", rows.data.length);
    //   if (rows.data.length <= 10) {
    //     const userPaymentsToDelete = rows.data.map(
    //       (d) => userPayments[d.dataIndex]
    //     );
    //     userPaymentsToDelete.forEach((a) => {
    //       if (a._id === user._id) {
    //         enqueueSnackbar(`You cannot delete your own record`, {
    //           variant: "error",
    //         });
    //         clearErrors();
    //       } else {
    //         enqueueSnackbar(
    //           `User ${a.firstName} ${a.lastName} (${a.QUBID}) deleted`,
    //           {
    //             variant: "success",
    //           }
    //         );
    //         deletePayment(a._id);
    //       }
    //     });
    //   } else {
    //     paymentContext.loading = true;
    //     console.log(loading);
    //     const userPaymentsToDelete = rows.data.map(
    //       (d) => userPayments[d.dataIndex]
    //     );
    //     userPaymentsToDelete.forEach((a) => {
    //       if (a._id === user._id) {
    //         enqueueSnackbar(`You cannot delete your own record`, {
    //           variant: "error",
    //         });
    //         clearErrors();
    //       } else {
    //         deletePayment(a._id);
    //       }
    //     });
    //     paymentContext.loading = false;
    //     console.log(loading);
    //   }
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
        display: false,
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
          return `£${value}`
        }
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
    // {
    //   name: "",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     empty: true,
    //     download: false,
    //     customBodyRenderLite: (dataIndex) => {
    //       return (
    //         <EditIcon
    //           onClick={(e) => {
    //             openDialog(e, dataIndex);
    //           }}
    //         />
    //       );
    //     },
    //   },
    // },
    // {
    //   name: "",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     empty: true,
    //     download: false,
    //     customBodyRenderLite: (dataIndex) => {
    //       return (
    //         <PersonIcon
    //           onClick={(e) => {
    //             editProfile(e, dataIndex);
    //           }}
    //         />
    //       );
    //     },
    //   },
    // },
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
          {userPayments !== null && !loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MUIDataTable
                  title="My Payments"
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

export default UserAdmin;
