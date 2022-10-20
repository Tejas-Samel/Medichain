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
import PublishIcon from "@material-ui/icons/Publish";
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
var appointmentFormat = {
  appointmentId: "",
  hospitalId: "",
  patientId: "",
  doctorId: "",
  time: "",
  description: "",
};

export default function GenerateLabRecord(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [appointmentId, setAppointmentId] = React.useState("");
  const [selectedLabRecordFile, setSelectedLabRecordFile] = React.useState("");
  const [appointment, setAppointment] = React.useState(appointmentFormat);

  var LabRecordSchema = {
    appointmentId: appointmentId,
    hospitalId: updatedData.hospitalId,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    documentType: "LabRecord",
  };
  let chosenFilename = "No File Selected";
  var laboratory = updatedData;
  var appointments = laboratory.appointments;
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
        console.log(LabRecordSchema);
        laboratory.listType = "appointments";
        laboratory.assetId = event.target.value;
        response = await axios.post(
          ADDRESS + `readIndividualAsset`,
          laboratory
        );
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
    } else if (event.target.name === "LabRecord") {
      console.log(event.target.files[0].name);
      setSelectedLabRecordFile(event.target.files[0]);
    }
    console.log("asd");
  };

  const uploadLabRecord = async (event) => {
    event.preventDefault();

    let response = "";
    try {
      let data = new FormData();
      data.append("file", selectedLabRecordFile, selectedLabRecordFile.name);
      data.append("appointmentId", LabRecordSchema.appointmentId);
      data.append("hospitalId", LabRecordSchema.hospitalId);
      data.append("patientId", LabRecordSchema.patientId);
      data.append("doctorId", LabRecordSchema.doctorId);
      data.append("time", new Date().toLocaleString());
      data.append("documentType", LabRecordSchema.documentType);
      data.append("sessionKey", laboratory.sessionKey);
      data.append("laboratoryId", laboratory.registrationId);

      setLoaded(true);
      response = await axios.post(ADDRESS + `generateLabRecord`, data);
      setLoaded(false);
      response = response.data;
      if (response === "Correct") {
        manageAppointmentDisplay();
        setSelectedLabRecordFile("");
        setAppointmentId("");
        setAppointment(appointmentFormat);
      } else {
        console.log(response);
      }
    } catch (e) {
      setLoaded(false);
      console.log(e);
    }
  };

  function createAppointmentMenuItems() {
    console.log("hert");
    console.log(appointments);
    let items = [];
    for (let i = 0; i < appointments.length; i++) {
      items.push(
        <MenuItem key={i} value={appointments[i]}>
          {appointments[i]}
        </MenuItem>
      );
    }
    return items;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={paper}>
          <Avatar style={avatar}>
            <PublishIcon />
          </Avatar>
          <Title>Upload Lab Record</Title>
          <form style={form} onSubmit={uploadLabRecord}>
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
                  defaultValue={LabRecordSchema.appointmentId}
                  onChange={handleChange}
                >
                  {createAppointmentMenuItems()}
                </TextField>
              </Grid>
            </Grid>
            <div id="currentAppointment" style={{ display: "none" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography component="p" variant="h6" align="center">
                    Patient Name : {localStorage.getItem(appointment.patientId)}
                    <br />
                    Doctor: {localStorage.getItem(appointment.doctorId)}
                    <br />
                    Time: {appointment.time}
                    <br />
                    Description : {appointment.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    color="primary"
                  >
                    Choose Lab Record
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                      name="LabRecord"
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    {selectedLabRecordFile === ""
                      ? chosenFilename
                      : selectedLabRecordFile.name}
                  </Typography>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={submit}
                >
                  Upload Lab Record
                </Button>
              </Grid>
            </div>
          </form>
        </div>
      </Container>
      <SpinnerDialog open={loaded} />
    </React.Fragment>
  );
}
