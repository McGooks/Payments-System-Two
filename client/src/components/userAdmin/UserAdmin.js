import React, { useContext, Fragment, useEffect } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
//Components
import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
// import CustomToolbar from "../layouts/CustomToolbar";

const UserAdmin = () => {
  const userAdminContext = useContext(UserAdminContext);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    users,
    getUsers,
    deleteUser,
    loading,
    error,
    clearErrors,
    setDialogOpen,
    setCurrent,
  } = userAdminContext;

  // const openEditDialog = (dataIndex) => {
  //   setDialogOpen();
  //   setCurrent(users[dataIndex]._id);
  //   console.log("Current is set to: ", current);
  // };

  useEffect(() => {
    getUsers();
    if (error) {
      enqueueSnackbar(`You cannot delete your own record`, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (users !== null && users.length === 0 && !loading) {
    return <h4>Please add a user</h4>; // if user list is empty
  }

  function handleClick(e, dataIndex) {
    e.preventDefault();
    setDialogOpen();
    setCurrent(users[dataIndex]._id);
    console.log("Handled Click", setCurrent(users[dataIndex]));
  }

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
      name: "QUBID",
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
    // customToolbar: () => {
    //   return <CustomToolbar />;
    // },
    onRowsDelete: (rows) => {
      console.log("Console log of", rows.data.length);
      if (rows.data.length <= 10) {
        const usersToDelete = rows.data.map((d) => users[d.dataIndex]);
        usersToDelete.map((a) => {
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
            deleteUser(a._id);
          }
        });
      } else {
        userAdminContext.loading = true;
        console.log(loading);
        const usersToDelete = rows.data.map((d) => users[d.dataIndex]);
        usersToDelete.map((a) => {
          if (a._id === user._id) {
            enqueueSnackbar(`You cannot delete your own record`, {
              variant: "error",
            });
            clearErrors();
          } else {
            deleteUser(a._id);
          }
        });
        userAdminContext.loading = false;
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
      name: "firstName",
      label: "First Name",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        display: true,
        download: true,
        sort: true,
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: true,
        display: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "status",
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
                handleClick(e, dataIndex);
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
          {users !== null && !loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MUIDataTable
                  title="Users"
                  data={users}
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
