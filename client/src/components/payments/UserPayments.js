import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
//Context
import { monthWords } from "../../utils/dropdowns";

//Components
import { Grid, Chip, Typography } from "@mui/material";
import { Pageview } from "@mui/icons-material";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";

const date = new Date().toUTCString();

const UserPayments = (props) => {
  const { user, userPayments, userPaymentsLoading } = props;

  const history = useNavigate();

  function MonthWords(i) {
    const arr = monthWords.map((value) => value.value);
    return arr[i - 1];
  }

  const viewPayment = (dataIndex) => {
    let path = `/payments/${dataIndex}`;
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
      filename: `${user.QUBID}Payments-${date}.csv`,
    },
    selectableRowsHideCheckboxes: false,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    rowsPerPage: 10,
    draggableColumns: {
      enabled: false,
    },
    selectableRowsHideCheckboxes: true,
    // customToolbar: () => {
    //   return <CustomToolbar />;
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
          }).format(value);
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
                    userID={tableMeta.rowData[0]}
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
          {userPayments !== null && !userPaymentsLoading ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <MUIDataTable
                  title={
                    <div>
                      <Typography variant="h5">My Payments</Typography>
                    </div>
                  }
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

export default UserPayments;
