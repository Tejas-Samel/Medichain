import React from "react";
import Link from "@material-ui/core/Link";
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
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { alpha, styled } from '@mui/material/styles';

const theme = createTheme();
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

export default function PharmacyInfo(props) {
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  var pharmacy = updatedData;
  pharmacy.password = "";
  pharmacy.id = pharmacy.registrationId;
  console.log(updatedData);
  const manageUpdateForm = () => {
    var x = document.getElementById("form");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
  const handleChange = (event) => {
    pharmacy[event.target.name] = event.target.value;
    console.log(pharmacy[event.target.name]);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoaded(true);
    let response = "";
    try {
      console.log(pharmacy);
      response = await axios.post(ADDRESS + `updateAsset`, pharmacy);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        console.log(response);
        manageUpdateForm();
        delete pharmacy.password;
        setUpdatedData(pharmacy);
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
      <Title>{updatedData.userName}</Title>
      <Typography component="span" variant="h6" align="center">
        
      <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>
                <CardContent>
                  <Typography component={'span'}>
                    <StyledIcon>
                      <AccountBoxIcon />
                    </StyledIcon>
                    UserName
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.userName}
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
              <Card style={cardCss}>
                <CardContent>
                  <Typography component={'span'}>
                    <StyledIcon>
                      <HomeIcon />
                    </StyledIcon>
                    Hospital
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.hospitalId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

      <Grid item xs={12} sm={6} md={4}>
              <Card style={cardCss}>
                <CardContent>
                  <Typography component={'span'}>
                    <StyledIcon>
                      <AccountBoxIcon />
                    </StyledIcon>
                    Registration ID
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} >
                    {updatedData.registrationId}
                  </Typography>
                </CardContent>
              </Card>
      </Grid>
      </Grid>
        
        {/* UserName : {updatedData.userName}
        <br />
        Phone : {updatedData.phone}
        <br />
        Hospital : {localStorage.getItem(updatedData.hospitalId)}
        <br />
        RegistrationId : {updatedData.registrationId} */}
      </Typography>
      <div align="center">
        <Link color="primary" onClick={manageUpdateForm}>
          Update Pharmacy Info
        </Link>
      </div>
      <div id="form" style={{ display: "none" }}>
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
                    variant="outlined"
                    required
                    fullWidth
                    id="phone"
                    label="Phone No."
                    name="phone"
                    autoComplete="phone"
                    defaultValue={pharmacy.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
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
    </React.Fragment>
  );
}
