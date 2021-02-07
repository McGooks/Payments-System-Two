import React, { useState, useContext, useEffect } from "react";
//Components
import { useSnackbar } from "notistack";
//Context
import AuthContext from "../../context/auth/authContext";

const Register = (props) => {
  const authContext = useContext(AuthContext);
  const { register, error, clearErrors, isAuthenticated } = authContext;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error) {
      enqueueSnackbar(`User already exists, please contact system administrator`, {
        variant: "error",
      })
      clearErrors();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    QUBID: "",
    email: "",
    password: "",
    password2: "",
  });
  const { QUBID, email, password, password2 } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (QUBID === "" || email === "" || password === "") {
      enqueueSnackbar(`Please complete all fields`, {
        variant: "warning",
      })
    } else if (password !== password2) {
      enqueueSnackbar(`Passwords do not match`, {
        variant: "error",
      })
    } else {
      register({
        QUBID,
        email,
        password,
      });
    }
  };
  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
      <div className="form-group">
          <label htmlFor="name">QUB ID</label>
          <input
            type="text"
            name="QUBID"
            value={QUBID}
            onChange={onChange}
            placeholder="QUB ID Number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}

            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}

            minLength="6"
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Register;
