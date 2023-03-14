import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "../../genericFiles/Title";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";
import PostAddIcon from "@material-ui/icons/PostAdd";
import MenuItem from "@material-ui/core/MenuItem";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";

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
const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function AssignDoctor(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [appointmentId, setAppointmentId] = React.useState("");
  const [doctorId, setDoctorId] = React.useState("");
  var doctorAssignment = {
    appointmentId: appointmentId,
    hospitalId: updatedData.registrationId,
    patientId: "",
    doctorId: doctorId,
  };
  const [appointment, setAppointment] = React.useState({
    appointmentId: "",
    hospitalId: "",
    patientId: "",
    time: "",
    description: "",
  });
  var hospital = updatedData;
  var appointments = hospital.appointments;
  console.log(updatedData);

  const manageAppointmentDisplay = () => {
    var x = document.getElementById("currentAppointment");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

  const handleChange = async (event) => {
    event.preventDefault();
    if (event.target.name === "appointmentId") {
      setLoaded(true);
      setAppointmentId(event.target.value);
      let response = "";
      try {
        console.log(doctorAssignment);
        hospital.listType = "appointments";
        hospital.assetId = event.target.value;
        response = await axios.post(ADDRESS + `readIndividualAsset`, hospital);
        response = response.data;
        console.log(response);
        if (response !== "Failed to fetch asset") {
          response = JSON.parse(response);
          setAppointment(response);
          console.log(response);
          manageAppointmentDisplay();
        } else {
          //show error message
          console.log(response);
        }
      } catch (e) {
        //show error message
        console.log("failed to connect to the server");
      }
      setLoaded(false);
    } else if (event.target.name === "doctorId") {
      setDoctorId(event.target.value);
    }
    console.log("asd");
  };

  const submitDoctorAssignment = async (event) => {
    event.preventDefault();
    setLoaded(true);
    let response = "";
    try {
      console.log(doctorAssignment);
      doctorAssignment.patientId = updatedData.userName;
      doctorAssignment.sessionKey = hospital.sessionKey;
      doctorAssignment.doctorId = doctorId;
      doctorAssignment.appointmentId = appointmentId;
      doctorAssignment.registrationId = doctorAssignment.hospitalId;
      console.log(doctorAssignment);
      response = await axios.post(ADDRESS + `assignDoctor`, doctorAssignment);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        console.log(response);
        setDoctorId("");
        manageAppointmentDisplay();
      } else {
        //show error message
        console.log(response);
      }
    } catch (e) {
      //show error message
      console.log(e);
    }
    setLoaded(false);
  };

  function createAppointmentMenuItems() {
   
    console.log(appointments);
    let items = [];
    for (let i = 0; i < appointments.length; i++) {
      items.push(
        <MenuItem key={i} value={appointments[i]}>
          {appointments[i]}
        </MenuItem>
      );
      //here I will be creating my options dynamically based on
      //what props are currently passed to the parent component
    }
    return items;
  }

  function createDoctorMenuItems() {

    console.log(hospital.doctors);
    let items = [];
    for (let i = 0; i < hospital.doctors.length; i++) {
      items.push(
        <MenuItem key={i} value={hospital.doctors[i]}>
          {localStorage.getItem(hospital.doctors[i])}  {hospital.doctors[i]}{" "}
        </MenuItem>
      );
      //here I will be creating my options dynamically based on
      //what props are currently passed to the parent component
    }
    return items;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={paper}>
          <Avatar style={avatar}>
            <PostAddIcon />
          </Avatar>
          <Title>Assign Doctor</Title>
          <form style={form} onSubmit={submitDoctorAssignment}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  id="select"
                  label="Appointment"
                  name="appointmentId"
                  autoComplete="appointment"
                  classes={{ root: classes.root }}
                  defaultValue={doctorAssignment.appointmentId}
                  onChange={handleChange}
                >
                  {createAppointmentMenuItems()}
                </TextField>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              id="currentAppointment"
              style={{ display: "none" }}
            >
              <Grid item xs={12}>
                <Typography component="p" variant="h6" align="center">
                  Patient Name : {appointment.patientId}
                  <br />
                  Time: {appointment.time}
                  <br />
                  Description : {appointment.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  id="select"
                  label="Doctor"
                  name="doctorId"
                  autoComplete="doctor"
                  classes={{ root: classes.root }}
                  defaultValue={doctorAssignment.doctorId}
                  onChange={handleChange}
                >
                  {createDoctorMenuItems()}
                </TextField>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={submit}
              >
                Assign Doctor
              </Button>
            </Grid>
          </form>
        </div>
      </Container>
      <SpinnerDialog open={loaded} />
    </React.Fragment>
  );
}
