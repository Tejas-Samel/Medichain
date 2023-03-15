import React, { Component } from "react";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";



export default function AddEmergencyContact(props) {
  const [patient, setpatient] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  
  console.log("------Emergency -----------");
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
      response = await axios.post(ADDRESS + `addEmergencyContact`, patient);
      response = response.data;
      console.log(response);
      
    } catch (e) {
      //show error message
      console.log("failed to connect to the server");
    }
    setLoaded(false);
  };
  return (
    <React.Fragment>
        <div align="center" style={{ margin: "25px" }}>
          <Button color="primary" variant="contained" onClick={manageUpdateForm}>
            Emergency Contacts
          </Button>
        </div>
      <div
        id="form"
        style={{
          display: "none",
          borderRadius: "15px",
          border: "3px solid",
          borderColor: "#eeeeee",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div>
            {/* <Avatar style={avatar}>
                <LockOutlinedIcon />
              </Avatar> */}
            <Typography component="h1" variant="h5">
              Emergency Contacts
            </Typography>
            <form onSubmit={submitForm}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="contactId"
                    variant="standard"
                    required
                    fullWidth
                    id="contactId"
                    label="Contact ID"
                    defaultValue={patient.firstName}
                    autoFocus={true}
                    onChange={handleChange}
                  />
                </Grid>
                
       
                
                

                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  // style={submit}
                >
                  Update
                </Button>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
      {/* <SpinnerDialog 
        // open={loaded}
         /> */}
    </React.Fragment>
  );
}
