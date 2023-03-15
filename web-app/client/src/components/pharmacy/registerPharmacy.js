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
import { Alert } from "react-bootstrap";

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

class registerPharmacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      phone: "",
      registrationId: "",
      hospitalId:"",
      type: "Pharmacy",
      SMSUpdates: false,
      isRegistered: false,
      errors: {},
      alertShow: false,
      alertData: "",
      alertHeading: "",
      loaded: false,
      hospitals: [],
    };
  }

  async componentDidMount() {
    this.setState({ loaded: true });
    try {
      let dataType = {
        dataType: "Hospital",
      };
      let response = await axios.post(ADDRESS + `getGenericData`, dataType);
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
      console.log(e);
    }
    this.setState({ loaded: false });
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
    if (!errors["registrationId"]) {
      let isRegistrationIdTaken = localStorage.getItem(
        this.state.registrationId
      );
      console.log(isRegistrationIdTaken);
      if (isRegistrationIdTaken !== null) {
        errors["registrationId"] = "*RegistrationId already in use";
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
        response = await axios.post(ADDRESS + `registerPharmacy`, this.state);
        this.setState({ loaded: false });
        response = response.data;
        console.log(response);
        if (response === "Correct") {
          localStorage.setItem(this.state.userName, "Pharmacy");
          localStorage.setItem(this.state.registrationId, "Laboratory");
          this.setState({ isRegistered: true });
          console.log(this.state);
        } else {
          this.setState({
            alertShow: true,
            alertData: response,
            alertHeading: "SignUp Error",
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
      return <Redirect to="/pharmacyLogin" />;
    } 
    else {
      const ifalert = this.state.alertShow;
      return (
        // <Container component="main" maxWidth="xs">
        //   <PopUp
        //     alertData={this.state.alertData}
        //     alertHeading={this.state.alertHeading}
        //     alertShow={this.state.alertShow}
        //     alertCloseFunc={() => this.setState({ alertShow: false })}
        //   />
        //   <CssBaseline />
        //   <div style={paper}>
        //     <Avatar style={avatar}>
        //       <LockOutlinedIcon />
        //     </Avatar>
        //     <Typography component="h1" variant="h5">
        //       Pharmacy SignUp
        //     </Typography>
        //     <form style={form} noValidate onSubmit={this.submitForm}>
        //       <Grid container spacing={2}>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             select
        //             id="select"
        //             label="Hospital"
        //             name="hospitalId"
        //             autoComplete="hospital"
        //             defaultValue={this.state.hospitalId || ""}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.hospitalId}
        //           >
        //             {this.createMenuItems()}
        //           </TextField>
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="phone"
        //             label="Phone No."
        //             name="phone"
        //             autoComplete="phone"
        //             defaultValue={this.state.phone}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.phone}
        //           />
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="registrationId"
        //             label="Registration Id"
        //             name="registrationId"
        //             autoComplete="45454545455"
        //             defaultValue={this.state.registrationId}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.registrationId}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="userName"
        //             label="UserName"
        //             name="userName"
        //             autoComplete="userName"
        //             defaultValue={this.state.userName}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.userName}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             name="password"
        //             label="Password"
        //             type="password"
        //             id="password"
        //             autoComplete="current-password"
        //             defaultValue={this.state.password}
        //             helperText={this.state.errors.password}
        //             onChange={this.handleChange}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <FormControlLabel
        //             control={
        //               <Checkbox
        //                 name="SMSUpdates"
        //                 defaultValue={this.state.SMSUpdates}
        //                 checked={this.state.SMSUpdates}
        //                 onChange={this.handleCheckBox}
        //                 color="primary"
        //               />
        //             }
        //             label="I want to receive information and updates via sms."
        //           />
        //         </Grid>
        //       </Grid>
        //       <Button
        //         type="submit"
        //         fullWidth
        //         variant="contained"
        //         color="primary"
        //         style={submit}
        //       >
        //         Sign Up
        //       </Button>
        //       <Grid container>
        //         <Grid item xs>
        //           <Link href="/" variant="body2">
        //             Home Page
        //           </Link>
        //         </Grid>
        //         <Grid item>
        //           <Link href="/pharmacyLogin" variant="body2">
        //             Already have an account? Sign in
        //           </Link>
        //         </Grid>
        //       </Grid>
        //     </form>
        //   </div>
        //   <Box mt={5}>
        //     <copyright.Copyright />
        //   </Box>
        //   <SpinnerDialog open={this.state.loaded} />
        // </Container>

        <div className="container py-5 h-90">
        <section className="vh-100">
          <div className="container-fluid bg-light" style={{ borderRadius: "25px" }}>
            <div className="row">
              <div className="col-sm-6 text-black">

                <CssBaseline />
                <div className="px-5 ms-xl-4">
                  <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{ color: "#709085" }}></i>
                  <span className="h1 fw-bold mb-auto d-flex justify-content-center">Medichain</span>
                </div>


                <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

                  <form style={{ width: "23rem" }} noValidate onSubmit={this.submitForm}>

                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Pharmacy Registration</h3>
                    {ifalert ? (<Alert variant ="danger">  {this.state.alertHeading} {this.state.alertData} </Alert>) : (<></>)}
                    {this.state.errors.userName ? (<Alert variant="danger">{this.state.errors.userName}</Alert>) : (<></>)}
                    {this.state.errors.registrationId? (<Alert variant="danger">{this.state.errors.registrationId}</Alert>) : (<></>)}
                    {this.state.errors.password ? (<Alert variant="danger">{this.state.errors.password}</Alert>) : (<></>)}
                    
                    <div className="form-outline mb-4">
                    <label className="form-label" fhtmlFor="Hospital">Hospital</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              required
                              fullWidth
                              select
                              id="select"
                              name="hospitalId"
                              autoComplete="hospital"
                              defaultValue={this.state.hospitalId}
                              onChange={this.handleChange}
                              helperText={this.state.errors.hospitalId}
                            >
                              {this.createMenuItems()}
                            </TextField>
                    </div>

                    <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="phone">Contact No.</label>
                                <input required type="text" id="phone" name="phone" defaultValue={this.state.phone} helperText={this.state.errors.phone}
                                  onChange={this.handleChange} className="form-control form-control-lg" />
                              </div>
                            </div>
                            <div className="col-md-6 mb-4">
                            <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registrationId">Registration ID</label>
                            <input required name="registrationId" defaultValue={this.state.registrationId}
                            onChange={this.handleChange}
                            id="registrationId" className="form-control form-control-lg" helperText={this.state.errors.registrationId}/>
                            </div>
                            </div>
                          </div>

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
                      <Button variant="contained" color="primary" type="submit" >Register</Button>
                    </div>

                    <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                    <p>Don't have an account? <a href="/registerDoctor" variant="body2">
                      Register here</a> <a href="/" variant="body2"> Home Page</a></p>

                  </form>

                </div>

              </div>
              <div className="col-sm-6 px-0 d-none d-sm-block" >
                <img src="https://images.pexels.com/photos/3683103/pexels-photo-3683103.jpeg?auto=compress&cs=tinysrgb&w=1600"
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

  removeNonNecessaryErrors = (event) => {
    delete this.state.errors.name;
    delete this.state.errors.bloodGroup;
    delete this.state.errors.medicalRegistrationNo;
    delete this.state.errors.lastName;
    delete this.state.errors.firstName;
    delete this.state.errors.aadhaar;
    delete this.state.errors.DOB;
    delete this.state.errors.specialisation;
    delete this.state.errors.firstName;
    delete this.state.errors.gender;
    delete this.state.errors.address;
  };
}

export default registerPharmacy;
