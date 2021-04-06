import React, { useContext, Fragment, useEffect } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import UserContext from "../../context/user/userContext";
//Components
import { Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/Person";
import Chip from "@material-ui/core/Chip";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
// import CustomToolbar from "../layouts/CustomToolbar";

const UserAdmin = (props) => {
  const userAdminContext = useContext(UserAdminContext);
  const userContext = useContext(UserContext);
  const { user } = props;
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

  const history = useHistory();

  useEffect(() => {
    getUsers();
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (users !== null && users.length === 0 && !loading) {
    return <h4>Please add a user</h4>; // if user list is empty
  }

  const openDialog = (e, dataIndex) => {
    e.preventDefault();
    setCurrent(users[dataIndex]);
    setDialogOpen();
  };

  const editProfile = (e, dataIndex) => {
    userContext.setCurrent(users[dataIndex]);
    let path = `/user/${users[dataIndex]._id}`;
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
        usersToDelete.forEach((a) => {
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
        usersToDelete.forEach((a) => {
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
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              <Grid container direction="row" alignContent="center" alignItems="center" justify="space-around">
                <Grid item spacing={10} align="center">
                  <EditIcon
                    onClick={(e) => {
                      openDialog(e, dataIndex);
                    }}
                  />
                  <Typography align="center" display="block" variant="caption">
                    Edit
                  </Typography>
                </Grid>
                <Typography align="center">
                  <PersonIcon
                    onClick={(e) => {
                      editProfile(e, dataIndex);
                    }}
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
          {users !== null && !loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MUIDataTable
                  title={
                    <div>
                      <Typography variant="h5">User Account Admin</Typography>
                      <Typography variant="caption">
                        Update basic user account information
                      </Typography>
                    </div>
                  }
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
