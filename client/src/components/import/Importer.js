import React, { Component, Fragment, useState } from "react";
// //Context
// import UserAdminContext from "../../context/userAdmin/userAdminContext";
// //UI to be included
import { Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import ProgressIndicator from "../layouts/Spinner";
import { useSnackbar } from "notistack";

//UI currently in Use
import { Button, Popconfirm, Row, Col, Upload } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../../utils/editable";

const Importer = () => {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    QUBID: "",
    role: "User",
    status: "Pending",
  });
  const { email, firstName, lastName, QUBID, role, status } = user;

  const [table, setTable] = useState({
    cols: [],
    rows: [],
    errorMessage: null,
    columns: [
      {
        title: "QUB ID",
        dataIndex: "QUBID",
        editable: true,
      },
      {
        title: "First Name",
        dataIndex: "firstName",
        editable: true,
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        editable: true,
      },
      {
        title: "Role",
        dataIndex: "role",
        editable: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        editable: true,
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) =>
          this.state.rows.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <DeleteOutlined
                type="delete"
                theme="filled"
                style={{ color: "red", fontSize: "20px" }}
              />
            </Popconfirm>
          ) : null,
      },
    ],
  });

  const handleSave = (row) => {
    const newData = [...table.rows];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setTable({ rows: newData });
  };

  const checkFile = (file) => {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  };

  const fileHandler = (fileList) => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      setTable({
        errorMessage: "No file uploaded!",
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type === "text/csv" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      setTable({
        errorMessage: "Unknown file format. Only Excel files are uploaded!",
      });
      return false;
    }

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
      //   const projectsToDelete = rows.data.map((d) => users[d.dataIndex]);
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
      //     deleteUser(a._id);
      //   }
      //   });
      // },
    };
    //just pass the fileObj as parameter
    const ExcelRenderer =
      (fileObj,
      (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          let newRows = [];
          // eslint-disable-next-line array-callback-return
          resp.rows.slice(1).map((row, index) => {
            if (row && row !== "undefined") {
              newRows.push({
                key: index,
                QUBID: row[0],
                firstName: row[1],
                lastName: row[2],
                email: row[3],
                role: "User",
                status: "Pending",
              });
            }
          });
          if (newRows.length === 0) {
            setTable({
              errorMessage: "No data found in file!",
            });
            return false;
          } else {
            setTable({
              cols: resp.cols,
              rows: newRows,
              errorMessage: null,
            });
          }
        }
      });
    return false;
  };


  const handleSubmit = async () => {
    console.log("submitting: ", this.state.rows);
    //submit to API
    //if successful, banigate and clear the data
    //this.setState({ rows: [] })
  };

  const handleDelete = (key) => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter((item) => item.key !== key) });
  };

 const handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count,
      QUBID: "[Insert ID]",
      firstName: "[First Name]",
      lastName: "[Last Name Name]",
      email: "[Email]",
      role: "User",
      status: "Pending",
    };
    setTable({
      rows: [newData, ...rows],
      count: count + 1,
    });
  };

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  const columns = this.state.columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: this.handleSave,
      }),
    };
  });

  return (
    <Fragment>
      <Row gutter={16}>
        <Col
          span={8}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="page-title">
              <h1>Upload User Data</h1>
            </div>
          </div>
        </Col>
        {/* <Col span={8}>
            <a
              href="https://res.cloudinary.com/bryta/raw/upload/v1562751445/Sample_Excel_Sheet_muxx6s.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Sample excel sheet
            </a>
          </Col> */}
        <Col
          span={8}
          align="right"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {this.state.rows.length > 0 && (
            <>
              <Button
                onClick={this.handleAdd}
                size="large"
                type="info"
                style={{ marginBottom: 16 }}
              >
                <PlusOutlined />
                Add a row
              </Button>{" "}
              <Button
                onClick={this.handleSubmit}
                size="large"
                type="primary"
                style={{ marginBottom: 16, marginLeft: 10 }}
              >
                Submit Data
              </Button>
            </>
          )}
        </Col>
      </Row>
      <div>
        <Upload
          name="file"
          beforeUpload={this.fileHandler}
          onRemove={() => setTable({ rows: [] })}
          multiple={false}
        >
          <Button>
            <UploadOutlined type="upload" /> Click to Upload File
          </Button>
        </Upload>
      </div>

      <div>
        <div>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <MUIDataTable
                title="Import Users"
                data={this.state.rows}
                columns={this.state.columns}
                options={components}
                components={components}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </Fragment>
  );
};

export default Importer;

// import React, { Component } from "react";
// import { Table, Button, Popconfirm, Row, Col, Upload } from "antd";
// import {
//   DeleteOutlined,
//   PlusOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import { ExcelRenderer } from "react-excel-renderer";
// import { EditableFormRow, EditableCell } from "../../utils/editable";

// export default class ExcelPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cols: [],
//       rows: [],
//       errorMessage: null,
//       columns: [
//         {
//           title: "NSP Number",
//           dataIndex: "nsp_number",
//           editable: true,
//         },
//         {
//           title: "Account",
//           dataIndex: "account",
//           editable: true,
//         },
//         {
//           title: "Project",
//           dataIndex: "project",
//           editable: true,
//         },
//         {
//           title: "Sub Analysis",
//           dataIndex: "subanalysis",
//           editable: true,
//         },
//         {
//           title: "Amount",
//           dataIndex: "amount",
//           editable: true,
//         },
//         {
//           title: "Student Cohort",
//           dataIndex: "student_cohort",
//           editable: true,
//         },
//         {
//           title: "Cohort ID",
//           dataIndex: "cohort_id",
//           editable: true,
//         },
//         {
//           title: "Action",
//           dataIndex: "action",
//           render: (text, record) =>
//             this.state.rows.length >= 1 ? (
//               <Popconfirm
//                 title="Sure to delete?"
//                 onConfirm={() => this.handleDelete(record.key)}
//               >
//                 <DeleteOutlined
//                   type="delete"
//                   theme="filled"
//                   style={{ color: "red", fontSize: "20px" }}
//                 />
//               </Popconfirm>
//             ) : null,
//         },
//       ],
//     };
//   }

//   handleSave = (row) => {
//     const newData = [...this.state.rows];
//     const index = newData.findIndex((item) => row.key === item.key);
//     const item = newData[index];
//     newData.splice(index, 1, {
//       ...item,
//       ...row,
//     });
//     this.setState({ rows: newData });
//   };

//   checkFile(file) {
//     let errorMessage = "";
//     if (!file || !file[0]) {
//       return;
//     }
//     const isExcel =
//       file[0].type === "application/vnd.ms-excel" ||
//       file[0].type ===
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//     if (!isExcel) {
//       errorMessage = "You can only upload Excel file!";
//     }
//     console.log("file", file[0].type);
//     const isLt2M = file[0].size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       errorMessage = "File must be smaller than 2MB!";
//     }
//     console.log("errorMessage", errorMessage);
//     return errorMessage;
//   }

//   fileHandler = (fileList) => {
//     console.log("fileList", fileList);
//     let fileObj = fileList;
//     if (!fileObj) {
//       this.setState({
//         errorMessage: "No file uploaded!",
//       });
//       return false;
//     }
//     console.log("fileObj.type:", fileObj.type);
//     if (
//       !(
//         fileObj.type === "application/vnd.ms-excel" ||
//         fileObj.type ===
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       )
//     ) {
//       this.setState({
//         errorMessage: "Unknown file format. Only Excel files are uploaded!",
//       });
//       return false;
//     }
//     //just pass the fileObj as parameter
//     ExcelRenderer(fileObj, (err, resp) => {
//       if (err) {
//         console.log(err);
//       } else {
//         let newRows = [];
//         // eslint-disable-next-line array-callback-return
//         resp.rows.slice(1).map((row, index) => {
//           if (row && row !== "undefined") {
//             newRows.push({
//               key: index,
//               nsp_number: row[0],
//               account: row[1],
//               project: row[2],
//               subanalysis: row[3],
//               amount: row[4],
//               student_cohort: row[5],
//               cohort_id: row[6],
//             });
//           }
//         });
//         if (newRows.length === 0) {
//           this.setState({
//             errorMessage: "No data found in file!",
//           });
//           return false;
//         } else {
//           this.setState({
//             cols: resp.cols,
//             rows: newRows,
//             errorMessage: null,
//           });
//         }
//       }
//     });
//     return false;
//   };

//   handleSubmit = async () => {
//     console.log("submitting: ", this.state.rows);
//     //submit to API
//     //if successful, banigate and clear the data
//     //this.setState({ rows: [] })
//   };

//   handleDelete = (key) => {
//     const rows = [...this.state.rows];
//     this.setState({ rows: rows.filter((item) => item.key !== key) });
//   };
//   handleAdd = () => {
//     const { count, rows } = this.state;
//     const newData = {
//       key: count,
//       nsp_number: "123456",
//       account: "6202",
//       project: "A2517EEC",
//       subanalysis: "",
//       amount: "117.84",
//       student_cohort: "Y",
//       cohort_id: "26",
//     };
//     this.setState({
//       rows: [newData, ...rows],
//       count: count + 1,
//     });
//   };

//   render() {
//     const components = {
//       body: {
//         row: EditableFormRow,
//         cell: EditableCell,
//       },
//     };
//     const columns = this.state.columns.map((col) => {
//       if (!col.editable) {
//         return col;
//       }
//       return {
//         ...col,
//         onCell: (record) => ({
//           record,
//           editable: col.editable,
//           dataIndex: col.dataIndex,
//           title: col.title,
//           handleSave: this.handleSave,
//         }),
//       };
//     });
//     return (
//       <>
//         <Row gutter={16}>
//           <Col
//             span={8}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "5%",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <div className="page-title">Upload User Data</div>
//             </div>
//           </Col>
//           {/* <Col span={8}>
//             <a
//               href="https://res.cloudinary.com/bryta/raw/upload/v1562751445/Sample_Excel_Sheet_muxx6s.xlsx"
//               target="_blank"
//               rel="noopener noreferrer"
//               download
//             >
//               Sample excel sheet
//             </a>
//           </Col> */}
//           <Col
//             span={8}
//             align="right"
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >
//             {this.state.rows.length > 0 && (
//               <>
//                 <Button
//                   onClick={this.handleAdd}
//                   size="large"
//                   type="info"
//                   style={{ marginBottom: 16 }}
//                 >
//                   <PlusOutlined />
//                   Add a row
//                 </Button>{" "}
//                 <Button
//                   onClick={this.handleSubmit}
//                   size="large"
//                   type="primary"
//                   style={{ marginBottom: 16, marginLeft: 10 }}
//                 >
//                   Submit Data
//                 </Button>
//               </>
//             )}
//           </Col>
//         </Row>
//         <div>
//           <Upload
//             name="file"
//             beforeUpload={this.fileHandler}
//             onRemove={() => this.setState({ rows: [] })}
//             multiple={false}
//           >
//             <Button>
//               <UploadOutlined type="upload" /> Click to Upload File
//             </Button>
//           </Upload>
//         </div>
//         <div style={{ marginTop: 20 }}>
//           <Table
//             components={components}
//             rowClassName={() => "editable-row"}
//             dataSource={this.state.rows}
//             columns={columns}
//           />
//         </div>
//       </>
//     );
//   }
// }
