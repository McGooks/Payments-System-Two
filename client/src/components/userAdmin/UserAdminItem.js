// import React, { useContext } from "react";
// import PropTypes from "prop-types";
// import UserAdminContext from "../../context/userAdmin/userAdminContext";

// const UserAdminItem = ({ user }) => {
//   const userContext = useContext(UserAdminContext);
//   const { deleteUser, setCurrent, clearCurrent } = userContext;
//   const { _id, QUBID, firstName, email, role, } = user;

//   const onDelete = () => {
//     deleteUser(_id);
//     clearCurrent();
//   };

//   return (
//     <div className="card bg-light">
//       <h3 className="text-primary text-left">
//         {QUBID}{" "}
//         <span
//           style={{ float: "right" }}
//           className={`badge ${
//             role === "user" ? "badge-success" : "badge-primary"
//           }`}
//         >
//           {role.charAt(0).toUpperCase() + role.slice(1)}
//         </span>
//       </h3>
//       <ul className="list">
//         {email && (
//           <li>
//             <i className="fas fa-envelope-open"></i> {email}
//           </li>
//         )}
//         {firstName && (
//           <li>
//             <i className="fas fa-phone"></i> {firstName}
//           </li>
//         )}
//       </ul>
//       <p>
//         <button
//           className="btn btn-dark btn-sm"
//           onClick={() => setCurrent(user)}
//         >
//           Edit
//         </button>
//         <button className="btn btn-danger btn-sm" onClick={onDelete}>
//           Delete
//         </button>
//       </p>
//     </div>
//   );
// };

// UserAdminItem.propTypes = {
//   user: PropTypes.object.isRequired,
// };

// export default UserAdminItem;
