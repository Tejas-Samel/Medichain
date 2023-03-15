import React, { useEffect } from "react";
import Link from "@material-ui/core/Link";
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
import { Card, CardContent, CardHeader } from "@material-ui/core";

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

const appointmentCard = {
  borderRadius: "15px",
  backgroundColor: "#bbdefb",
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function BookHospitalAppointment(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [hospitals, setHospitals] = React.useState([]);
  var appointment = {
    appointmentId: "",
    hospitalId: "",
    patientId: "",
    time: "",
    description: "",
  };
  var patient = updatedData;
  console.log(updatedData);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoaded(true);
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
        setHospitals(hospitals);
        console.log(hospitals);
      } catch (e) {
        console.log(e);
      }
      setLoaded(false);
    };
    fetchHospitals();
  }, []);

  const handleChange = (event) => {
    appointment[event.target.name] = event.target.value;
    console.log(appointment[event.target.name]);
  };

  const submitAppointment = async (event) => {
    event.preventDefault();
    setLoaded(true);
    let response = "";
    try {
      console.log(appointment);
      appointment.patientId = updatedData.userName;
      appointment.appointmentId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      console.log(appointment);
      appointment.sessionKey = patient.sessionKey;
      appointment.userName = patient.userName;
      response = await axios.post(ADDRESS + `createAppointment`, appointment);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        console.log(response);
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
  console.log(hospitals);

  function createMenuItems() {
    console.log("hert");
    console.log(hospitals);
    let items = [];
    for (let i = 0; i < hospitals.length; i++) {
      items.push(
        <MenuItem key={i} value={hospitals[i]["hospitalId"]}>
          {hospitals[i]["hospitalName"] + " " + hospitals[i]["hospitalId"]}
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
        <div
          style={{
            borderRadius: "15px",
            border: "3px solid",
            borderColor: "#eeeeee",
            padding: "45px",
          }}
        >
          {updatedData.appointments.length ? (
            <Card style={appointmentCard}>
              <CardHeader title="Appointment ID"></CardHeader>
              <CardContent>
                <Typography>{updatedData.appointments}</Typography>
              </CardContent>
            </Card>
          ) : (
            <div style={paper}>
              <Avatar style={avatar}>
                <PostAddIcon />
              </Avatar>
              <Title>Book Appointment</Title>
              <form style={form} onSubmit={submitAppointment}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      select
                      id="select"
                      label="Hospital"
                      name="hospitalId"
                      autoComplete="hospital"
                      classes={{ root: classes.root }}
                      defaultValue={appointment.hospitalId || ""}
                      onChange={handleChange}
                    >
                      {createMenuItems()}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="time"
                      name="time"
                      label="Appointment Time"
                      type="datetime-local"
                      defaultValue={appointment.time}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ height: 240 }}>
                    <TextField
                      // minRows={5}
                      multiline={true}
                      autoComplete="Description"
                      name="description"
                      variant="standard"
                      required
                      fullWidth
                      id="description"
                      label="Describe the Ailment "
                      // autoFocus={true}
                      onChange={handleChange}
                      defaultValue={appointment.description}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={submit}
                    >
                      Book Appointment
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          )}
        </div>
      </Container>
      <SpinnerDialog open={loaded} />
    </React.Fragment>
  );
}
