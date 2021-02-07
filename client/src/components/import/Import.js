import React, { useState, useRef, useContext } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext"
//UI
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Upload from "@material-ui/icons/Backup";
import TextField from "@material-ui/core/TextField";
import PublishIcon from "@material-ui/icons/Publish";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  button: {
    backgroundColor: "rgb(214, 0, 13)",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
    width: "54ch",
  },
}));

const Import = () => {
  const classes = useStyles();
  const userAdminContext = useContext(UserAdminContext);
  const authContext = useContext(AuthContext)
  const { user } = authContext;
  const {
    importUsers,
    getImportUsers,
    addUser,
    loading,
    error,
    clearErrors,
    setDialogOpen,
    setCurrent,
  } = userAdminContext;

  console.log(getImportUsers)

  const [filestate, setFilestate] = useState({
    file: "",
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const fileUploader = useRef(null);

  const handleClick = (e) => {
    fileUploader.current.focus();
  };

  const filePathset = (e) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    enqueueSnackbar(`File ${file.name} is ready to be imported`, {
      variant: "success",
    });
    setFilestate({ file });
  };

  const readFile = () => {
    var f = filestate.file;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      let importUserString = convertToJson(data); // shows data in json format
      console.log("HITTING STRING", importUserString)
    };
    reader.readAsBinaryString(f);
    console.log("F >>>>>>", f)
  };

  const convertToJson = (csv) => {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
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
    // onRowsDelete: (rows) => {
    //   const projectsToDelete = rows.data.map((d) => importUsers[d.dataIndex]);
    //   projectsToDelete.map((a) => {
    //     if (a._id === user._id) {
    //         enqueueSnackbar(`You cannot delete your own record`, {
    //           variant: "error",
    //         });
    //         clearErrors();
    //     } else {
    //     enqueueSnackbar(`User ${a.firstName} ${a.lastName} (${a.QUBID}) deleted`, {
    //       variant: "success",
    //     });
    //   }
    //   });
    // },
  };

  const columns = [
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
    //             handleClick(e, dataIndex);
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
    <>
      <div className={classes.root}>
        <div>
          <input
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className={classes.input}
            id="contained-button-file"
            type="file"
            ref={fileUploader}
            onChange={filePathset}
          />
          <label htmlFor="contained-button-file">
            <Button
              component="span"
              size="large"
              className={classes.button}
              color="secondary"
              variant="contained"
              startIcon={<Upload />}
              onClick={handleClick}
            >
              Select File to Upload
            </Button>
          </label>
          <TextField
            className={classes.textField}
            component="span"
            disabled
            id="filename"
            type="text"
            name="filename"
            value={filestate.file.name}
          />
        </div>
        <div>
          <Button
            component="span"
            size="large"
            className={classes.button}
            color="secondary"
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={readFile}
          >
            Publish File
          </Button>
        </div>
        <div>
        <div>
          {importUsers !== null && !loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MUIDataTable
                  title="Users"
                  data={importUsers}
                  columns={columns}
                  options={options}
                  // components={{
                  //   TableFilterList: CustomFilterList,
                  // }}
                />
              </Grid>
            </Grid>
          ) : (
            <ProgressIndicator />
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Import;
