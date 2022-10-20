import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ADDRESS } from "../genericFiles/constants";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import { createTheme } from "@material-ui/core/styles";
import copyright from "../genericFiles/copyright";
import MenuItem from "@material-ui/core/MenuItem";
import { validateForm } from "../genericFiles/validateForm";
import PopUp from "../genericFiles/PopUp";
import SpinnerDialog from "../genericFiles/SpinnerDialog";

const theme = createTheme();

const avatar = {
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
};
const paper = {
  marginTop: theme.spacing(7),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const form = {
  width: "100%", // Fix IE 11 issue.
  marginTop: theme.spacing(3),
};
const submit = {
  margin: theme.spacing(3, 0, 2),
};

class registerDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      address: "",
      aadhaar: "",
      DOB: "",
      gender: "",
      specialisation: "",
      userName: "",
      password: "",
      phone: "",
      hospitalId: "",
      type: "Doctor",
      SMSUpdates: false,
      isRegistered: false,
      errors: {},
      alertShow: false,
      alertData: "",
      alertHeading: "",
      hospitals: [],
      loaded: false,
    };
  }

  async componentDidMount() {
    try {
      let dataType = {
        dataType: "Hospital",
      };
      this.setState({ loaded: true });
      let response = await axios.post(ADDRESS + `getGenericData`, dataType);
      this.setState({ loaded: false });
      response = response.data;
      console.log(response);
      let hospitals = [];

      for (let i = 0; i < response.length; i++) {
        let item = {};
        item["hospitalName"] = response[i].Record.name;
        item["hospitalId"] = response[i].Record.registrationId;
        console.log(item);
        hospitals.push(item);
      }
      console.log(hospitals);
      this.setState({ hospitals: hospitals });
      console.log(this.state.hospitals);
    } catch (e) {
      this.setState({ loaded: false });
      console.log(e);
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleCheckBox = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };

  createMenuItems() {
    let items = [];
    for (let i = 0; i < this.state.hospitals.length; i++) {
      items.push(
        <MenuItem key={i} value={this.state.hospitals[i]["hospitalId"]}>
          {this.state.hospitals[i]["hospitalName"] +
            " " +
            this.state.hospitals[i]["hospitalId"]}
        </MenuItem>
      );
      //here I will be creating my options dynamically based on
      //what props are currently passed to the parent component
    }
    return items;
  }

  submitForm = async (event) => {
    event.preventDefault();
    console.log(this.state);
    let errors = validateForm(this.state);
    console.log(!errors["userName"]);
    if (!errors["userName"]) {
      let isUserNameTaken = localStorage.getItem(this.state.userName);
      console.log(isUserNameTaken);
      if (isUserNameTaken !== null) {
        errors["userName"] = "*userName already taken";
      }
    }
    if (!errors["aadhaar"]) {
      let isAadhaarTaken = localStorage.getItem(this.state.aadhaar);
      console.log(isAadhaarTaken);

      if (isAadhaarTaken !== null) {
        errors["aadhaar"] = "*aadhaar already in use";
      }
    }
    if (!errors["medicalRegistrationNo"]) {
      let isMedicalRegistrationNoTaken = localStorage.getItem(
        this.state.medicalRegistrationNo
      );
      console.log(isMedicalRegistrationNoTaken);
      if (isMedicalRegistrationNoTaken !== null) {
        errors["medicalRegistrationNo"] =
          "*medicalRegistrationNo already in use";
      }
    }

    this.setState({ errors: errors });
    this.state.errors = errors;
    this.removeNonNecessaryErrors();
    console.log(this.state.errors);
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    if (!isInvalid) {
      let response = "";
      try {
        this.setState({ loaded: true });
        response = await axios.post(ADDRESS + `registerDoctor`, this.state);
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (response === "Correct") {
          localStorage.setItem(
            this.state.userName,
            this.state.firstName + " " + this.state.lastName
          );
          localStorage.setItem(
            this.state.aadhaar,
            this.state.firstName + " " + this.state.lastName
          );
          localStorage.setItem(
            this.state.medicalRegistrationNo,
            this.state.firstName + " " + this.state.lastName
          );
          this.setState({ isRegistered: true });
          console.log(this.state);
        } else {
          this.setState({
            alertShow: true,
            alertData: response,
            alertHeading: "SigUp Error",
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
  };

  render() {
    if (this.state.isRegistered === true) {
      return <Redirect to="/doctorLogin" />;
    } else {
      return (
        <Container component="main" maxWidth="xs">
          <PopUp
            alertData={this.state.alertData}
            alertHeading={this.state.alertHeading}
            alertShow={this.state.alertShow}
            alertCloseFunc={() => this.setState({ alertShow: false })}
          />
          <CssBaseline />
          <div style={paper}>
            <Avatar style={avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Doctor SignUp
            </Typography>
            <form style={form} noValidate onSubmit={this.submitForm}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    defaultValue={this.state.firstName}
                    onChange={this.handleChange}
                    helperText={this.state.errors.firstName}
                    autoFocus={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    defaultValue={this.state.lastName}
                    onChange={this.handleChange}
                    helperText={this.state.errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Gender"
                    name="gender"
                    autoComplete="gender"
                    defaultValue={this.state.gender}
                    onChange={this.handleChange}
                    helperText={this.state.errors.gender}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="date"
                    label="Date of Birth"
                    type="date"
                    name="DOB"
                    defaultValue={this.state.DOB}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={this.state.errors.DOB}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="phone"
                    label="Phone No."
                    name="phone"
                    autoComplete="phone"
                    defaultValue={this.state.phone}
                    onChange={this.handleChange}
                    helperText={this.state.errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="aadhaar"
                    label="Aadhaar"
                    name="aadhaar"
                    autoComplete="45454545455"
                    defaultValue={this.state.aadhaar}
                    onChange={this.handleChange}
                    helperText={this.state.errors.aadhaar}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Hospital"
                    name="hospitalId"
                    autoComplete="hospital"
                    defaultValue={this.state.hospitalId}
                    onChange={this.handleChange}
                    helperText={this.state.errors.hospitalId}
                  >
                    {this.createMenuItems()}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="specialisation"
                    name="specialisation"
                    variant="outlined"
                    required
                    fullWidth
                    id="specialisation"
                    label="Specialisation"
                    defaultValue={this.state.specialisation}
                    onChange={this.handleChange}
                    helperText={this.state.errors.specialisation}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="medicalRegistrationNo"
                    label="Medical Registration No"
                    name="medicalRegistrationNo"
                    autoComplete="45454545455"
                    defaultValue={this.state.medicalRegistrationNo}
                    onChange={this.handleChange}
                    helperText={this.state.errors.medicalRegistrationNo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="India"
                    defaultValue={this.state.address}
                    onChange={this.handleChange}
                    helperText={this.state.errors.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="userName"
                    label="UserName"
                    name="userName"
                    autoComplete="userName"
                    defaultValue={this.state.userName}
                    onChange={this.handleChange}
                    helperText={this.state.errors.userName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    defaultValue={this.state.password}
                    helperText={this.state.errors.password}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="SMSUpdates"
                        defaultValue={this.state.SMSUpdates}
                        checked={this.state.SMSUpdates}
                        onChange={this.handleCheckBox}
                        color="primary"
                      />
                    }
                    label="I want to receive information and updates via sms."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={submit}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Home Page
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/doctorLogin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <copyright.Copyright />
          </Box>
          <SpinnerDialog open={this.state.loaded} />
        </Container>
      );
    }
  }

  removeNonNecessaryErrors = (event) => {
    delete this.state.errors.bloodGroup;
    delete this.state.errors.registrationId;
    delete this.state.errors.name;
  };
}

export default registerDoctor;
