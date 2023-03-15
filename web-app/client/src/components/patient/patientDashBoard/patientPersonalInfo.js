import React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "../../genericFiles/Title";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ContactPhoneIcon from "@material-ui/icons/Phone";
import HomeIcon from '@material-ui/icons/Home';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CalendarToday from '@material-ui/icons/CalendarToday';
import WcIcon from '@material-ui/icons/Wc';
// import BloodtypeIcon from '@material-ui/icons/';

import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import PropTypes from "prop-types";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { alpha, styled } from '@mui/material/styles';


const theme = createTheme({
  shadows: ["none"]
});
const avatar = {
  margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
};
const paper = {
  marginTop: theme.spacing(2),
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

const cardCss = {
  minWidth: 200,
  height: 125,
  paddingTop: 10,
  paddingBottom: 60,
  boxShadow: 0,
  boxSizing: "border-box",
  borderRadius: 12,
  backdropFilter: "blur(10px)",
  backgroundColor: "#D1E9FC",
  boxShadow: 0,
  fontSize: "1rem",
  color: " rgb(6, 27, 100)",
}
const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  justifyContent: 'center',
  color: "rgb(16, 57, 150)",
  backgroundImage: "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)",
  // marginBottom: theme.spacing(3),
}));




export default function PatientPersonalInfo(props) {
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);

  var patient = updatedData;
  patient.password = "";
  patient.id = patient.userName;
  console.log(patient);
  const manageUpdateForm = () => {
    var x = document.getElementById("form");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
  const handleChange = (event) => {
    patient[event.target.name] = event.target.value;
    console.log(patient[event.target.name]);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoaded(true);
    let response = "";
    try {
      console.log(patient);
      response = await axios.post(ADDRESS + `updateAsset`, patient);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        console.log(response);
        manageUpdateForm();
        delete patient.password;
        setUpdatedData(patient);
      } else {
        //show error message
        console.log(response);
      }
    } catch (e) {
      //show error message
      console.log("failed to connect to the server");
    }
    setLoaded(false);
  };

  return (
    <React.Fragment>
      <div style={{ borderRadius: "20px", margin: "1%" }}>
        <Title>
          {updatedData.firstName} {updatedData.lastName}
        </Title>
      </div>
      

      <div style={{ borderRadius: "20px" }} >

        <Typography component="span" variant="h6" align="center">

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>
                <CardContent>

                  <Typography component={'span'} >
                    <StyledIcon>
                      <CalendarToday />
                    </StyledIcon>
                    Date of Birth
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.DOB}

                  </Typography>

                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>

                <CardContent>

                  <Typography component={'span'} >
                    <StyledIcon>
                      <WcIcon />
                    </StyledIcon>
                    Gender
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.gender}
                  </Typography>

                </CardContent>


              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>



                <CardContent>

                  <Typography component={'span'}>
                    <StyledIcon>
                      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g>
                        <path d="M0,0h24v24H0V0z" fill="none" /></g><g>
                          <path fill="rgb(16, 57, 150)" d="M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M15,18H9v-2h6V18z M15,13h-2 v2h-2v-2H9v-2h2V9h2v2h2V13z" /></g></svg>
                    </StyledIcon>
                    Blood Group
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.bloodGroup}

                  </Typography>

                </CardContent>


              </Card>
            </Grid>



            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>
                <CardContent>

                  <Typography component={'span'}>
                    <StyledIcon>
                      <PermIdentityIcon />
                    </StyledIcon>
                    Aadhaar
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.aadhaar}

                  </Typography>

                </CardContent>


              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>



                <CardContent>

                  <Typography component={'span'}>
                    <StyledIcon>
                      <ContactPhoneIcon />
                    </StyledIcon>
                    Phone
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.phone}
                  </Typography>

                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss} >
                <CardContent>

                  <Typography component={'span'}>
                    <StyledIcon>
                      <HomeIcon />
                    </StyledIcon>
                    Address
                  </Typography>

                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.address}
                  </Typography>

                </CardContent>

              </Card>
            </Grid>
          </Grid>

          {/* UserName : {updatedData.userName}
        <br />
        Date of Birth : {updatedData.DOB}
        <br />
        Gender : {updatedData.gender}
        <br />
        BloodGroup : {updatedData.bloodGroup}
        <br />
        Phone : {updatedData.phone}
        <br />
        Aadhaar : {updatedData.aadhaar}
        <br />
        Address : {updatedData.address} */}
        </Typography>
        <div align="center" style={{ margin: "25px" }}>
          <Button color="primary" variant="contained" onClick={manageUpdateForm}>
            Update Patient Info
          </Button>
        </div>
        <div id="form" style={{ display: "none", borderRadius: "15px", border: "3px solid",borderColor:"#eeeeee" }}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={paper}>
              <Avatar style={avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Update Info
              </Typography>
              <form style={form} onSubmit={submitForm}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="standard"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      defaultValue={patient.firstName}
                      autoFocus={true}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      defaultValue={patient.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="date"
                      label="Date of Birth"
                      type="date"
                      name="DOB"
                      defaultValue={patient.DOB}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="bloodGroup"
                      name="bloodGroup"
                      variant="standard"
                      required
                      fullWidth
                      id="bloodGroup"
                      label="Blood Group"
                      defaultValue={patient.bloodGroup}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="phone"
                      label="Phone No."
                      name="phone"
                      autoComplete="phone"
                      defaultValue={patient.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="aadhaar"
                      label="Aadhaar"
                      name="aadhaar"
                      autoComplete="45454545455"
                      defaultValue={patient.aadhaar}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="India"
                      defaultValue={patient.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={submit}
                  >
                    Update
                  </Button>
                </Grid>
              </form>
            </div>
          </Container>
        </div>
        <SpinnerDialog open={loaded} />
      </div>
    </React.Fragment>
  );
}
