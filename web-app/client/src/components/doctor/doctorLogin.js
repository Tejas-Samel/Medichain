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

class doctorLogin extends Component {
  constructor(props) {
    localStorage.removeItem("doctorToken");
    super(props);
    const token = localStorage.getItem("doctorToken");
    console.log(token);
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      userName: "",
      password: "",
      medicalRegistrationNo: "",
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
    if (!this.state.medicalRegistrationNo) {
      errors["medicalRegistrationNo"] =
        "*Please Enter the medicalRegistrationNo";
    }
    this.setState({ errors: errors });
    this.state.errors = errors;
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    if (!isInvalid) {
      const doctorCredentials = {
        id: this.state.medicalRegistrationNo,
        userName: this.state.userName,
        password: this.state.password,
      };
      let response;
      try {
        this.setState({ loaded: true });
        response = await axios.post(
          ADDRESS + `verifyPassword`,
          doctorCredentials
        );
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (
          response.data !== "Incorrect" &&
          response.data !== "Failed to verify password"
        ) {
          let doctorToken = {
            medicalRegistrationNo: this.state.medicalRegistrationNo,
            sessionKey: response.data,
          };
          localStorage.setItem("doctorToken", JSON.stringify(doctorToken));
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
            pathname: "/doctorDashBoard",
          }}
        />
      );
    }

    return (
      <Grid container component="main" style={root}>
        <PopUp
          alertData={this.state.alertData}
          alertHeading={this.state.alertHeading}
          alertShow={this.state.alertShow}
          alertCloseFunc={() => this.setState({ alertShow: false })}
        />
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} style={image} />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div style={paper}>
            <Avatar style={avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Doctor SignIn
            </Typography>
            <form style={form} noValidate onSubmit={this.submitForm}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="userName"
                label="UserName"
                name="userName"
                autoComplete="userName"
                autoFocus
                defaultValue={this.state.userName}
                onChange={this.handleChange}
                helperText={this.state.errors.userName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="medicalRegistrationNo"
                label="Medical Registration No"
                name="medicalRegistrationNo"
                autoComplete="medicalRegistrationNo"
                autoFocus
                defaultValue={this.state.medicalRegistrationNo}
                onChange={this.handleChange}
                helperText={this.state.errors.medicalRegistrationNo}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                defaultValue={this.state.password}
                onChange={this.handleChange}
                helperText={this.state.errors.password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Home Page
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/registerDoctor" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <copyright.Copyright />
              </Box>
            </form>
          </div>
        </Grid>
        <SpinnerDialog open={this.state.loaded} />
      </Grid>
    );
  }
}

export default doctorLogin;
