import React, { useState, useRef, useContext } from "react";
//Context
import UserAdminContext from "../../context/userAdmin/userAdminContext";
import AuthContext from "../../context/auth/authContext";
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
  

const importExcel = () => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
          const bufferArray = e.target.result
          const wb=XLSX.read(bufferArray,{type: "buffer"})
          const wsname=wb.SheetNames[0]
          const ws=wb.Sheets[wsname]
          const data=XLSX.utils.sheet_to_json(ws)
          resolve(data)
      }
      fileReader.onerror = ((error) => {
          reject(error)
      })
    });
    promise.then((d) => {
        console.log(d)
    })
  };

  const onChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    enqueueSnackbar(`File is ready to be imported`, {
      variant: "success",
    });
    readExcel(file);
  };

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
          {jsonFile !== null ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <MUIDataTable
                  title="Users"
                  data={jsonFile}
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
    </>
  );
};

export default importExcel;
