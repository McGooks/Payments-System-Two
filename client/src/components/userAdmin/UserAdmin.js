import React, { useContext, Fragment, useEffect } from "react";
//Context
import AlertContext from "../../context/alert/alertContext";
import UserAdminContext from "../../context/userAdmin/userAdminContext";
//Components
import { Grid } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import CustomToolbar from "../layouts/CustomToolbar";

const UserAdmin = () => {
  const userAdminContext = useContext(UserAdminContext);
  const alertContext = useContext(AlertContext);
  const { users, getUsers, deleteUser, loading, error, clearErrors } = userAdminContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getUsers();
    console.log(loading ? "Off" : "On")

    if (error === "You cannot delete your own record") {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(users);
  if (users !== null && users.length === 0 && !loading) {
    return <h4>Please add a user</h4>; // if user list is empty
  }

  const CustomChip = ({ label, onDelete }) => {
    return (
      <Chip
        variant="outlined"
        color="secondary"
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
      name: 'QUBID',
      direction: 'asc'
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
    customToolbar: () => {
      return <CustomToolbar />;
    },
    onRowsDelete: (rows) => {
      const projectsToDelete = rows.data.map((d) => users[d.dataIndex]);
      console.log(projectsToDelete)
      projectsToDelete.map(a => deleteUser(a._id))
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
      label: "ID",
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
    // {
    //   name: "name",
    //   label: "Name",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customBodyRenderLite: (params) => {
    //       let val = users[params].firstName + " " + users[params].lastName;
    //       return val;
    //     },
    //   },
    // },
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
      name: "Edit",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <button
              onClick={() =>
                window.alert(
                  `Clicked "Edit" for row ${rowIndex} with dataIndex of ${dataIndex}`
                )
              }
            >
              Edit
            </button>
          );
        },
      },
    },
    {
      name: "Add",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <button
              onClick={() => {
                const { data } = this.state;
                data.unshift([
                  "Mason Ray",
                  "Computer Scientist",
                  "San Francisco",
                  39,
                  "$142,000",
                ]);
                this.setState({ data });
              }}
            >
              Add
            </button>
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
