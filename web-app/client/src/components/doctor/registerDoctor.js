import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ADDRESS } from "../genericFiles/constants";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { createTheme } from "@material-ui/core/styles";
import copyright from "../genericFiles/copyright";
import MenuItem from "@material-ui/core/MenuItem";
import { validateForm } from "../genericFiles/validateForm";
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
const box = {
  height: "100%",
  width: "100%"
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
        //       Doctor SignUp
        //     </Typography>
        //     <form style={form} noValidate onSubmit={this.submitForm}>
        //       <Grid container spacing={2}>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             autoComplete="fname"
        //             name="firstName"
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="firstName"
        //             label="First Name"
        //             defaultValue={this.state.firstName}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.firstName}
        //             autoFocus={true}
        //           />
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="lastName"
        //             label="Last Name"
        //             name="lastName"
        //             autoComplete="lname"
        //             defaultValue={this.state.lastName}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.lastName}
        //           />
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             select
        //             id="select"
        //             label="Gender"
        //             name="gender"
        //             autoComplete="gender"
        //             defaultValue={this.state.gender}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.gender}
        //           >
        //             <MenuItem value="Male">Male</MenuItem>
        //             <MenuItem value="Female">Female</MenuItem>
        //             <MenuItem value="Other">Other</MenuItem>
        //           </TextField>
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="date"
        //             label="Date of Birth"
        //             type="date"
        //             name="DOB"
        //             defaultValue={this.state.DOB}
        //             onChange={this.handleChange}
        //             InputLabelProps={{
        //               shrink: true,
        //             }}
        //             helperText={this.state.errors.DOB}
        //           />
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
        //             id="aadhaar"
        //             label="Aadhaar"
        //             name="aadhaar"
        //             autoComplete="45454545455"
        //             defaultValue={this.state.aadhaar}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.aadhaar}
        //           />
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             select
        //             id="select"
        //             label="Hospital"
        //             name="hospitalId"
        //             autoComplete="hospital"
        //             defaultValue={this.state.hospitalId}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.hospitalId}
        //           >
        //             {this.createMenuItems()}
        //           </TextField>
        //         </Grid>
        //         <Grid item xs={12} sm={6}>
        //           <TextField
        //             autoComplete="specialisation"
        //             name="specialisation"
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="specialisation"
        //             label="Specialisation"
        //             defaultValue={this.state.specialisation}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.specialisation}
        //           />
        //         </Grid>

        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="medicalRegistrationNo"
        //             label="Medical Registration No"
        //             name="medicalRegistrationNo"
        //             autoComplete="45454545455"
        //             defaultValue={this.state.medicalRegistrationNo}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.medicalRegistrationNo}
        //           />
        //         </Grid>
        //         <Grid item xs={12}>
        //           <TextField
        //             variant="outlined"
        //             required
        //             fullWidth
        //             id="address"
        //             label="Address"
        //             name="address"
        //             autoComplete="India"
        //             defaultValue={this.state.address}
        //             onChange={this.handleChange}
        //             helperText={this.state.errors.address}
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
        //           <Link href="/doctorLogin" variant="body2">
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
        <div id="main-wrapper">  
        <section className="h-100 bg-secondary" style={{display: "flex"}}>
          <div className="container  h-100" >
            <div className="row d-flex justify-content-center align-items-center h-80">
              <div className="col">
                <div className="card card-registration my-4" style={{borderRadius: "25px"}}>
                  <div className="row g-0">
                    <div className="col-xl-6 d-none d-xl-block">
                      <img src="https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=1300&h=1000&dpr=1"
                        alt="photo" className="img-fluid"
                        style={{ borderRadius: "25px"}} />
                    </div>
                    <div className="col-xl-6" >
                      <form noValidate onSubmit={this.submitForm}>
                        <div className="card-body p-md-5 text-black">
                          <h3 className="mb-5 text-uppercase">Doctor Registration Form</h3>
                          {/* ALL alerts and errors in the form */}
                          {ifalert ? (<Alert variant="danger"> {this.state.alertHeading}  {this.state.alertData} </Alert>):(<></>)}
                          {this.state.errors.firstName ? (<Alert variant="danger">{this.state.errors.firstName}</Alert>) : (<></>)}
                          {this.state.errors.lastName ? (<Alert variant="danger">{this.state.errors.lastName}</Alert>) : (<></>)}
                          {this.state.errors.gender ? (<Alert variant="danger">{this.state.errors.gender}</Alert>) : (<></>)}
                          {this.state.errors.phone ? (<Alert variant="danger">{this.state.errors.phone}</Alert>) : (<></>)}
                          {this.state.errors.aadhaar ? (<Alert variant="danger">{this.state.errors.aadhaar}</Alert>) : (<></>)}
                          {this.state.errors.hospitals ? (<Alert variant="danger">{this.state.errors.hospitals}</Alert>) : (<></>)}
                          {this.state.errors.specialisation ? (<Alert variant="danger">{this.state.errors.specialisation}</Alert>) : (<></>)}
                          {this.state.errors.medicalRegistrationNo ? (<Alert variant="danger">{this.state.errors.medicalRegistrationNo}</Alert>) : (<></>)}
                          {this.state.errors.bloodGroup ? (<Alert variant="danger">{this.state.errors.bloodGroup}</Alert>) : (<></>)}
                          {this.state.errors.address ? (<Alert variant="danger">{this.state.errors.address}</Alert>) : (<></>)}
                          {this.state.errors.userName ? (<Alert variant="danger">{this.state.errors.userName}</Alert>) : (<></>)}
                          {this.state.errors.password ? (<Alert variant="danger">{this.state.errors.password}</Alert>) : (<></>)}
                    
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className="form-outline">

                                <label className="form-label" htmlFor="firstName">First name</label>

                                <input required type="text" name="firstName" id="firstName" defaultValue={this.state.firstName}
                                  onChange={this.handleChange} className="form-control " />
                              </div>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="form-outline">
                                <label className="form-label" htmlFor="lastName">Last name</label>

                                <input  type="text" id="lastName" name="lastName" defaultValue={this.state.lastName}
                                  onChange={this.handleChange} className="form-control" required="true"/>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className="form-outline">
                                <label className="form-label" htmlFor="phone">Contact No.</label>

                                <input required type="text" id="phone" name="phone" defaultValue={this.state.phone} helperText={this.state.errors.phone}
                                  onChange={this.handleChange} className="form-control " />
                              </div>
                            </div>
                            <div className="col-md-6 mb-4">
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="DOB">Date of Birth</label>

                              <input type="date" id="date" name="DOB"
                                defaultValue={this.state.DOB}
                                onChange={this.handleChange} className="form-control" />
                            </div>
                            </div>
                          </div>
                          <div className="d-md-flex justify-content-start align-items-center">
                            <div className="form-outline m-4">
                              <label className="form-label" htmlFor="gender">Gender</label>

                              <TextField
                                variant="outlined"
                                required
                                fullWidth
                                select
                                id="select"
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
                            </div>
                            <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="address">Address</label>

                            <input type="text" id="address" name="address" defaultValue={this.state.address} helperText={this.state.errors.address}
                              onChange={this.handleChange} className="form-control " />
                          </div>
                          </div>
                          
                          <div className="form-outline mb-4 ">
                            <label className="form-label" fhtmlFor="Aadhaar">Aadhaar</label>

                            <input type="text" id="aadhaar"
                              label="Aadhaar"
                              name="aadhaar" defaultValue={this.state.aadhaar} helperText={this.state.errors.aadhaar}
                              onChange={this.handleChange} className="form-control   col-md-6" />
                          </div>

                          <div className="form-outline mb-4 ">
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
                            {/* <input type="text" id="select"
                              autoComplete="hospital"
                              required
                              label="Hospital"
                              name="hospitalId" defaultValue={this.state.hospitalId} helperText={this.state.errors.hospitalId}
                              onChange={this.handleChange} className="form-control   col-md-6" /> */}
                          </div>

                          <div className="form-outline mb-4 ">
                            <label className="form-label" fhtmlFor="Specialization">Specialisation</label>

                            <TextField
                            autoComplete="specialisation"
                            size="small"
                            name="specialisation"
                            variant="outlined"
                            required
                            fullWidth
                            id="specialisation"
                            defaultValue={this.state.specialisation}
                            onChange={this.handleChange}
                            helperText={this.state.errors.specialisation}
                            />
                          </div>

                          <div className="form-outline mb-4 ">
                            <label className="form-label" fhtmlFor="medicalRegistrationNo">Medical Registration Number</label>
                            <TextField
                            variant="outlined"
                            size="small"
                            required
                            fullWidth
                            id="medicalRegistrationNo"
                            name="medicalRegistrationNo"
                            autoComplete="45454545455"
                            defaultValue={this.state.medicalRegistrationNo}
                            onChange={this.handleChange}
                            helperText={this.state.errors.medicalRegistrationNo}
                            />

                            {/* <input type="text" id="medicalRegistrationNo"
                              label="Medical Registration No"
                              name="medicalRegistrationNo" defaultValue={this.state.medicalRegistrationNo} helperText={this.state.errors.medicalRegistrationNo}
                              onChange={this.handleChange} className="form-control   col-md-6" /> */}
                          </div>



                          <div className="form-outline mb-4 col-md-6">
                            <label className="form-label" fhtmlFor="userName">Username</label>

                            <input type="text" id="userName"
                              label="UserName"
                              name="userName" defaultValue={this.state.userName} helperText={this.state.errors.userName}
                              onChange={this.handleChange} className="form-control " />
                          </div>

                          <div className="form-outline mb-4 col-md-6">
                            <label className="form-label" fhtmlFor="password">Password</label>

                            <input type="password" defaultValue={this.state.password}
                              label="Password" className="form-control "
                              onChange={this.handleChange} name="password"
                              id="password" helperText={this.state.errors.password}
                            />
                          </div>



                          <div className="d-flex justify-content-end pt-3">
                            {/* <button type="button" className="btn btn-light btn-lg">Reset all</button> */}
                            <Button type="submit" variant="contained" color="primary" >Submit</Button>
                          </div>

                        </div>
                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Box mt={5}>
              <copyright.Copyright />
            </Box>
            <SpinnerDialog open={this.state.loaded} />
          </div>
        </section>
      </div>
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
