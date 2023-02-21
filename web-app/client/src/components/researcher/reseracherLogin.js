import React, { Component } from "react";
import axios from "axios";
import { ADDRESS } from "../genericFiles/constants";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import { createTheme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import copyright from "../genericFiles/copyright";
import PopUp from "../genericFiles/PopUp";
import SpinnerDialog from "../genericFiles/SpinnerDialog";
import { Alert } from "react-bootstrap";

const theme = createTheme();
const image = {
  backgroundImage: `url(${require("../stockImages/loginBackground.jpg")})`, //'url(https://www.imedicalapps.com/wp-content/uploads/2017/12/iStock-669282098.jpg)',
  backgroundRepeat: "no-repeat",
  backgroundColor:
    theme.palette.type === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
  backgroundSize: "cover",
  backgroundPosition: "center",
};
const root = {
  height: "100vh",
};
const avatar = {
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
};
const paper = {
  margin: theme.spacing(8, 4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const form = {
  width: "100%", // Fix IE 11 issue.
  marginTop: theme.spacing(1),
};
const submit = {
  margin: theme.spacing(3, 0, 2),
};

class researcherLogin extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem("researcherToken");
    const token = localStorage.getItem("researcherToken");
    console.log(token);
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      userName: "",
      password: "",
      registrationId: "",
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
    if (!this.state.registrationId) {
      errors["registrationId"] = "*Please Enter the registrationId";
    }
    this.setState({ errors: errors });
    this.state.errors = errors;
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    if (!isInvalid) {
      const researcherCredentials = {
        id: this.state.registrationId,
        userName: this.state.userName,
        password: this.state.password,
      };
      let response;
      try {
        this.setState({ loaded: true });
        response = await axios.post(
          ADDRESS + `verifyPassword`,
          researcherCredentials
        );
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (
          response.data !== "Incorrect" &&
          response.data !== "Failed to verify password"
        ) {
          let researcherToken = {
            registrationId: this.state.registrationId,
            sessionKey: response.data,
          };
          localStorage.setItem(
            "researcherToken",
            JSON.stringify(researcherToken)
          );
          this.setState({
            loggedIn: true,
            sessionKey: response.data,
          });
        } else {
          this.setState({
            alertShow: true,
            alertHeading: "SigIn Error",
            alertData: response.data,
          });
        }
      } catch (e) {
        this.setState({
          loaded: false,
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
            pathname: "/researcherDashBoard",
          }}
        />
      );
    }
    const ifalert = this.state.alertData;
    return (
      // <Grid container component="main" style={root}>
      //   <PopUp
      //     alertData={this.state.alertData}
      //     alertHeading={this.state.alertHeading}
      //     alertShow={this.state.alertShow}
      //     alertCloseFunc={() => this.setState({ alertShow: false })}
      //   />
      //   <CssBaseline />
      //   <Grid item xs={false} sm={4} md={7} style={image} />

      //   <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      //     <div style={paper}>
      //       <Avatar style={avatar}>
      //         <LockOutlinedIcon />
      //       </Avatar>
      //       <Typography component="h1" variant="h5">
      //         Researcher SignIn
      //       </Typography>
      //       <form style={form} noValidate onSubmit={this.submitForm}>
      //         <TextField
      //           variant="outlined"
      //           margin="normal"
      //           required
      //           fullWidth
      //           id="userName"
      //           label="UserName"
      //           name="userName"
      //           autoComplete="userName"
      //           autoFocus
      //           defaultValue={this.state.userName}
      //           onChange={this.handleChange}
      //           helperText={this.state.errors.userName}
      //         />
      //         <TextField
      //           variant="outlined"
      //           margin="normal"
      //           required
      //           fullWidth
      //           id="registrationId"
      //           label="Registration Id"
      //           name="registrationId"
      //           autoComplete="registrationId"
      //           autoFocus
      //           defaultValue={this.state.registrationId}
      //           onChange={this.handleChange}
      //           helperText={this.state.errors.registrationId}
      //         />
      //         <TextField
      //           variant="outlined"
      //           margin="normal"
      //           required
      //           fullWidth
      //           name="password"
      //           label="Password"
      //           type="password"
      //           id="password"
      //           autoComplete="current-password"
      //           defaultValue={this.state.password}
      //           onChange={this.handleChange}
      //           helperText={this.state.errors.password}
      //         />
      //         <FormControlLabel
      //           control={<Checkbox value="remember" color="primary" />}
      //           label="Remember me"
      //         />
      //         <Button
      //           type="submit"
      //           fullWidth
      //           variant="contained"
      //           color="primary"
      //           style={submit}
      //         >
      //           Sign In
      //         </Button>
      //         <Grid container>
      //           <Grid item xs>
      //             <Link href="/" variant="body2">
      //               Home Page
      //             </Link>
      //           </Grid>
      //           <Grid item>
      //             <Link href="/registerResearcher" variant="body2">
      //               {"Don't have an account? Sign Up"}
      //             </Link>
      //           </Grid>
      //         </Grid>
      //         <Box mt={5}>
      //           <copyright.Copyright />
      //         </Box>
      //       </form>
      //     </div>
      //   </Grid>
      //   <SpinnerDialog open={this.state.loaded} />
      // </Grid>

      <div className="container py-5 h-90">
        <section className="vh-100">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6 text-black">

                <CssBaseline />
                <div className="px-5 ms-xl-4">
                  <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{ color: "#709085" }}></i>
                  <span className="h1 fw-bold mb-auto d-flex justify-content-center">MediChain</span>
                </div>


                <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

                  <form style={{ width: "23rem" }} noValidate onSubmit={this.submitForm}>

                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Researcher Login</h3>
                    {ifalert ? (
                      <Alert> {this.state.alertData} </Alert>
                    ) : (<br />)}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="userName">Username</label>
                      <input name="userName" defaultValue={this.state.userName}
                        onChange={this.handleChange}
                        id="userName" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="registrationId">Registration Id</label>
                      <input name="registrationId" defaultValue={this.state.registrationId}
                        onChange={this.handleChange}
                        id="registrationId" className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Password</label>

                      <input type="password" defaultValue={this.state.password}
                        label="Password" className="form-control form-control-lg"
                        onChange={this.handleChange} name="password"
                        id="password" />
                    </div>

                    <div className="pt-1 mb-4">
                      <Button variant="contained" color="primary" type="submit" >Login</Button>
                    </div>

                    <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                    <p>Don't have an account? <a href="/registerResearcher" variant="body2">
                      Register here</a><a href="/" variant="body2">Homepage</a></p>

                  </form>

                </div>

              </div>
              <div className="col-sm-6 px-0 d-none d-sm-block">
                <img src="https://images.pexels.com/photos/3912365/pexels-photo-3912365.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Login image" className="w-100 vh-100" style={{ objectFit: "cover", objectPosition: "left" }} />
              </div>
            </div>
          </div><SpinnerDialog open={this.state.loaded} />
        </section>

      </div>
    );
  }
}

export default researcherLogin;
