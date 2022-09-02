import React, { useState, useRef, useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import { Grid, Typography, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Upload from "@mui/icons-material/Backup";
import TextField from "@mui/material/TextField";
import PublishIcon from "@mui/icons-material/Publish";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import MUIDataTable from "mui-datatables";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import clsx from "clsx";

const PREFIX = 'ImportNSP';

const classes = {
  root: `${PREFIX}-root`,
  input: `${PREFIX}-input`,
  button: `${PREFIX}-button`,
  textField: `${PREFIX}-textField`,
  button2: `${PREFIX}-button2`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },

  [`& .${classes.input}`]: {
    display: "none",
  },

  [`& .${classes.button}`]: {
    backgroundColor: "rgb(214, 0, 13)",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.textField}`]: {
    margin: theme.spacing(1),
    width: "54ch",
  },

  [`& .${classes.button2}`]: {
    margin: theme.spacing(1),
  }
}));

const mergeById = (a1, a2) =>
  a1.map((itm) => ({
    ...a2.find((item) => item.QUBID === itm.QUBID && item),
    ...itm,
  }));

const ImportNSP = (props) => {

  const userAdminContext = useContext(UserAdminContext);
  const {
    getUsersNSP,
    updateUserNSP,
    usersNSP,
    error,
    clearErrors,
    clearNSPUser,
    loading,
  } = userAdminContext;

  const [filestate, setFilestate] = useState({
    file: "",
  });
  const [jsonFile, setJsonFileState] = useState([]);
  const [NSPUserState, setNSPUserState] = useState(usersNSP);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const fileUploader = useRef(null);
  const [enable, setEnable] = useState(true);

  const handleClick = (e) => {
    fileUploader.current.focus();
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (filestate.ile !== "") {
      userAdminContext.loading = true;
      try {
        jsonFile.map((d) => {
          NSPUserState[d.__rowNum__ - 1] = usersNSP[d.__rowNum__ - 1];
          setNSPUserState([...NSPUserState]);
        });
        setJsonFileState(mergeById(NSPUserState, jsonFile));
        userAdminContext.loading = false;
      } catch (err) {
        console.error(err.message);
        enqueueSnackbar(error, {
          variant: "error",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(`File ${file.name} cannot be imported`, {
        variant: "error",
      });
    }
  };

  const readFile = (file) => {
    userAdminContext.loading = true;
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
      setJsonFileState(d);
      d.map((a) => {
        getUsersNSP(a.QUBID);
      });
    });
    userAdminContext.loading = false;
  };

  const onLookup = (e) => {
    userAdminContext.loading = true;
    e.preventDefault();
    try {
      jsonFile.map((d) => {
        NSPUserState[d.__rowNum__ - 1] = usersNSP[d.__rowNum__ - 1];
        setNSPUserState([...NSPUserState]);
      });
      setJsonFileState(mergeById(NSPUserState, jsonFile));
      userAdminContext.loading = false;
      setEnable(false);
    } catch (err) {
      console.error(err.message);
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  };

  const reset = () => {
    setJsonFileState([]);
    setNSPUserState([]);
    setFilestate({
      file: "",
    });
    clearNSPUser();
  };
  const onSubmit = (e) => {
    e.preventDefault();
    try {
      jsonFile.map((d) => {
        updateUserNSP(d);
      });
      setJsonFileState([]);
    } catch (err) {
      console.error(err.message);
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
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
      name: "NSPID",
      label: "NSPID",
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
      name: "status",
      label: "Status",
      options: {
        filter: true,
        display: true,
        download: true,
        sort: false,
        customBodyRenderLite: (value) => (value = "Pending Import"),
      },
    },
  ];

  return (
    (<Root>
      <Grid container spacing={1}>
        <Grid item xs={12} spacing={1}>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={clsx(classes.root, classes.left)}>
                <div>
                  <Typography variant="h5">NSP Data Import</Typography>
                  <Typography variant="caption">
                    Please only use this tool, for locating and updating user
                    accounts with their NSP ID
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} className={clsx(classes.root, classes.left)}>
                <div>
                  <input
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className={clsx(classes.input, classes.button)}
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {jsonFile.length > 0 && !loading ? (
          <>
            <Grid item xs={12} spacing={1}>
              <MUIDataTable
                data={jsonFile}
                columns={columns}
                options={options}
              />
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.button, classes.right)}
                >
                  <Button
                    component="span"
                    size="large"
                    className={classes.button}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                    }}
                    variant="contained"
                    startIcon={<CheckCircleOutline />}
                    onClick={onLookup}
                  >
                    Check Users
                  </Button>
                  <Button
                    disabled={enable}
                    component="span"
                    size="large"
                    className={classes.button}
                    color="secondary"
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={onSubmit}
                  >
                    Import NSP ID's
                  </Button>
                  <Button
                    component="span"
                    size="large"
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={reset}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <hr></hr>
        )}
      </Grid>
      <Grid container spacing={10}>
        <Grid
          item
          xs={12}
          className={clsx(classes.footer, classes.left)}
        ></Grid>
      </Grid>
    </Root>)
  );
};

export default ImportNSP;
