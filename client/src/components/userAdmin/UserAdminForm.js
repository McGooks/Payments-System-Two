import React, { useState, useContext, useEffect } from "react";
import UserAdminContext from "../../context/user/userAdminContext"

const UserAdminFrom = () => {
  const userContext = useContext(UserAdminContext);
  const { addUser, clearCurrent, current, updateUser } = userContext;


  useEffect(() => {
    if (current !== null) {
      setUser(current);
    } else {
      setUser({
        QUBID: "",
        email: "",
        firstName: "",
        role: "user",
      });
    }
  }, [userContext, current]);

  const [user, setUser] = useState({
    QUBID: "",
    email: "",
    firstName: "",
    role: "user",
  });

  const { QUBID, firstName, email, role, } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (current === null) {
      addUser(user);
    } else {
      updateUser(user)
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">
        {current ? "Edit User" : "Add User"}
      </h2>
      <input
        type="text"
        name="QUBID"
        placeholder="QUBID"
        value={QUBID}
        onChange={onChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        name="firstName"
        placeholder="firstName"
        value={firstName}
        onChange={onChange}
      />
      <h5>User Type</h5>
      <input
        type="radio"
        name="type"
        value="personal"
        checked={role === "user"}
        onChange={onChange}
      />
      {" "}User{" "}
      <input
        type="radio"
        name="type"
        value="professional"
        checked={role === "admin"}
        onChange={onChange}
      />
      {" "}Admin
      <div>
        <input
          type="submit"
          value={current ? "Update User" : "Add User"}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default UserAdminFrom;
