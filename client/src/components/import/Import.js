import React, { useState, useRef, useContext, useEffect } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
//UI
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, CardHeader } from "@material-ui/core";
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

const Import = (props) => {
  const classes = useStyles();
  const userAdminContext = useContext(UserAdminContext);
  const { addUser, error, clearErrors } = userAdminContext;

  const [filestate, setFilestate] = useState({
    file: "",
  });
  const [jsonFile, setJsonFileState] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const fileUploader = useRef(null);

  const handleClick = (e) => {
    fileUploader.current.focus();
  };

  useEffect(() => {
    console.log(error);
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const onChange = (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      var file = e.target.files[0];
      readFile(file);
      setFilestate({ file });
      enqueueSnackbar(`File ${file.name} is ready to be imported`, {
        variant: "success",
      });
    } catch (err) {
      console.error(err.message);
      enqueueSnackbar(`File ${file.name} cannot be imported`, {
        variant: "error",
      });
    }
  };

  const readFile = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      console.log(d);
      setJsonFileState(d);
    });
  };

  const makePassword = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    try {
    jsonFile.map((d) => {
      let makeRandomPassword = { password: makePassword(10) };
      let userWithAddedRandomPassword = Object.assign(d, makeRandomPassword);
        addUser(userWithAddedRandomPassword);
      })
      setJsonFileState([]);
  } catch (err) {
    console.error(err.message);
    enqueueSnackbar(error, {
      variant: "error",
    });
  };
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
    onRowsDelete: (rows) => {
      const usersToDelete = rows.data.map((d) => jsonFile[d.dataIndex]);
      const newState = jsonFile.filter((item) => !usersToDelete.includes(item));
      setJsonFileState(newState);
    },
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
        <Card className={classes.root}>
          <CardHeader
            title="Multi-User Import"
            subheader="Please use the excel template provided"
          />

          <div>
            <input
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className={classes.input}
              id="contained-button-file"
              type="file"
              ref={fileUploader}
              onChange={onChange}
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
        </Card>
        <div>
          {jsonFile !== null ? (
            <>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <MUIDataTable
                    data={jsonFile}
                    columns={columns}
                    options={options}
                    // components={{
                    //   TableFilterList: CustomFilterList,
                    // }}
                  />
                </Grid>
              </Grid>
              <div>
                <Button
                  component="span"
                  size="large"
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={onSubmit}
                >
                  Publish File
                </Button>
              </div>
            </>
          ) : (
            <ProgressIndicator />
          )}
        </div>
      </div>
    </>
  );
};

export default Import;
