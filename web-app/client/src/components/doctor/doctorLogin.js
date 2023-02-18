import React, { Component } from "react";
import axios from "axios";
import { ADDRESS } from "../genericFiles/constants";
import { Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import copyright from "../genericFiles/copyright";
import SpinnerDialog from "../genericFiles/SpinnerDialog";
import { Alert } from "react-bootstrap";
import { validateForm } from "../genericFiles/validateForm";

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
    event.preventDefault()
    console.log(this.state);
    let errors = {};
    // console.log(!errors["userName"]);
    // if (!errors["userName"]) {
    //   let isUserNameTaken = localStorage.getItem(this.state.userName);
    //   console.log(isUserNameTaken);
    //   if (isUserNameTaken !== null) {
    //     errors["userName"] = "*userName already taken";
    //   }
    // }
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
    console.log(this.state.errors);
    let isInvalid = Object.getOwnPropertyNames(this.state.errors).length;
    if (!isInvalid) {
      const doctorCredentials = {
        id: this.state.medicalRegistrationNo,
        userName: this.state.userName,
        password: this.state.password,
      };
      let response = "";
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
          console.log(doctorToken)
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
    const ifalert = this.state.alertShow;
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
      //         Doctor SignIn
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
      //           id="medicalRegistrationNo"
      //           label="Medical Registration No"
      //           name="medicalRegistrationNo"
      //           autoComplete="medicalRegistrationNo"
      //           autoFocus
      //           defaultValue={this.state.medicalRegistrationNo}
      //           onChange={this.handleChange}
      //           helperText={this.state.errors.medicalRegistrationNo}
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
      //             <Link href="/registerDoctor" variant="body2">
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

      ///////////////////////////////////////////////////////////////////
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

                    <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Doctor's Log in</h3>
                    {ifalert ? (<Alert variant ="danger">  {this.state.alertHeading} {this.state.alertData} </Alert>) : (<></>)}
                    {this.state.errors.userName ? (<Alert variant="danger">{this.state.errors.userName}</Alert>) : (<></>)}
                    {this.state.errors.medicalRegistrationNo ? (<Alert variant="danger">{this.state.errors.medicalRegistrationNo}</Alert>) : (<></>)}
                    {this.state.errors.password ? (<Alert variant="danger">{this.state.errors.password}</Alert>) : (<></>)}
                    
                    
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="userName">Username</label>
                      <input name="userName" defaultValue={this.state.userName}
                        onChange={this.handleChange}
                        id="userName" className="form-control form-control-lg" helperText={this.state.errors.userName}/>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="medicalRegistrationNo">Medical Registration Number</label>

                      <input name="medicalRegistrationNo" defaultValue={this.state.medicalRegistrationNo}
                        label="Medical Registration Number" className="form-control form-control-lg"
                        onChange={this.handleChange}
                        helperText={this.state.errors.medicalRegistrationNo}
                        id="medicalRegistrationNo" />

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
                    <p>Don't have an account? <a href="/registerDoctor" variant="body2">
                      Register here</a> <a href="/" variant="body2"> Home Page</a></p>

                  </form>

                </div>

              </div>
              <div className="col-sm-6 px-0 d-none d-sm-block" >
                <img src="https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600"
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

export default doctorLogin;
