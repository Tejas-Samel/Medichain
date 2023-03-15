import React, { Component } from "react";
import axios from "axios";
import { ADDRESS } from "../genericFiles/constants";
import { Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";

import { Alert } from "react-bootstrap";

import PopUp from "../genericFiles/PopUp";
import SpinnerDialog from "../genericFiles/SpinnerDialog";
import { Box } from "@material-ui/core";
import copyright from "../genericFiles/copyright";

class patientLogin extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem("patientToken");
    const token = localStorage.getItem("patientToken");
    // console.log(token);
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      userName: "",
      password: "",
      alertData: "",
      alertShow: false,
      alertHeading: "",
      sessionKey: "",
      loggedIn,
      errors: {},
      loaded: false,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitForm = async (event) => {

    event.preventDefault();
    let errors = {};
    if (!this.state.userName) {
      errors["userName"] = "*Please Enter the userName";
    }
    if (!this.state.password) {
      errors["password"] = "*Please Enter the password";
    }
    this.setState({ errors: errors });
    

    console.log(errors);
    this.state.errors = errors;
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    console.log(isInvalid)
    if (!isInvalid) {
      const patientCredentials = {
        id: this.state.userName,
        password: this.state.password,
      };
      let response = "";
      try {
        console.log(this.patientCredentials);

        this.setState({ loaded: true });
        console.log('HELLO');
        response = await axios.post(
          ADDRESS + `verifyPassword`,
          patientCredentials
        );
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (
          response.data !== "Incorrect" &&
          response.data !== "Failed to verify password"
        ) {
          let patientToken = {
            userName: this.state.userName,
            sessionKey: response.data,
          };
          // console.log("_____TOKEN____")
          // console.log(patientToken)
          localStorage.setItem("patientToken", JSON.stringify(patientToken));
          this.setState({
            loggedIn: true,
            sessionKey: response.data,
          });
        } else {
          this.setState({
            alertShow: true,
            alertHeading: "SignIn Error",
            alertData: response.data,
          });
        }
      } catch (e) {
        this.setState({
          loaded: true,
          alertShow: true,
          alertHeading: "Server Error",
          alertData: "Can not connect to the server",
        });
      }
    }
    console.log(this.state);
  };

  render() {
    if (this.state.loggedIn === true) {
      return (
        <Redirect
          to={{
            pathname: "/patientDashBoard",
          }}
        />
      );
    }
    const ifalert = this.state.alertData;

    return (
      <div className="container py-5 h-90">
        <section className="vh-100">
          <div className="container-fluid bg-light" style={{ borderRadius: "25px" }}>
            <div className="row">
              <div className="col-sm-6 text-black">

                <CssBaseline />
                <div className="px-5 ms-xl-4">
                  <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{ color: "#709085" }}></i>
                  <span className="h1 fw-bold mb-auto d-flex justify-content-start">MediChain</span>
                </div>


                <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

                  <form style={{ width: "23rem" }} noValidate onSubmit={this.submitForm}>

                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Patient Log in</h3>
                    {ifalert ? (
                      <Alert> {this.state.alertData} </Alert>
                    ) : (<br />)}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="userName">Username</label>
                      <input name="userName" defaultValue={this.state.userName}
                        onChange={this.handleChange}
                        id="userName" className="form-control form-control-lg" helperText={this.state.errors.userName}/>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Password</label>

                      <input type="password" defaultValue={this.state.password}
                        label="Password" className="form-control form-control-lg"
                        onChange={this.handleChange} name="password"
                        helperText={this.state.errors.password}
                        id="password" />

                    </div>

                    <div className="pt-1 mb-4">
                      <Button variant="contained" color="primary" type="submit" >Login</Button>
                    </div>

                    <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                    <p>Don't have an account? <a href="/registerPatient" variant="body2">
                      Register here</a><a href="/" variant="body2">Homepage</a></p>

                  </form>

                </div>

              </div>
              <div className="col-sm-6 px-0 d-none d-sm-block" >
                <img src="https://images.unsplash.com/flagged/photo-1578535689084-b804a326a840?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGF0aWVudHxlbnwwfDF8MHx8&auto=format&fit=crop&w=500&q=60"
                  alt="Login image" className="w-100 vh-100" style={{ objectFit: "cover", objectPosition: "left", borderRadius: "25px" }} />
              </div>
            </div>
            <Box mt={5}>
              <copyright.Copyright />
            </Box>
          </div><SpinnerDialog open={this.state.loaded} />
        </section>

      </div>

    );
  }
}

export default patientLogin;
