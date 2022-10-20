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
  time: "",
  description: "",
};

export default function GenerateEHR(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [appointmentId, setAppointmentId] = React.useState("");
  const [selectedEHRFile, setSelectedEHRFile] = React.useState("");
  const [appointment, setAppointment] = React.useState(appointmentFormat);
  const [pharmacy, setPharmacy] = React.useState(" ");
  const [laboratory, setLaboratory] = React.useState(" ");
  const [allPharmacies, setAllPharmacies] = React.useState([]);
  const [allLaboratories, setAllLaboratories] = React.useState([]);

  var EHRSchema = {
    appointmentId: appointmentId,
    hospitalId: updatedData.currentHospital,
    patientId: appointment.patientId,
    doctorId: updatedData.medicalRegistrationNo,
    documentType: "EHR",
  };
  let chosenFilename = "No File Selected";
  var doctor = updatedData;
  var appointments = doctor.appointments;
  console.log(updatedData);

  useEffect(() => {
    const fetchPharmaciesAndLaboratoriesData = async () => {
      try {
        setLoaded(true);
        let payloadSchema = {
          dataType: "Pharmacy",
          hospitalId: updatedData.hospitalId,
        };
        let response = await axios.post(
          ADDRESS + `getGenericData`,
          payloadSchema
        );
        response = response.data;
        console.log(response);
        console.log(typeof response);
        if (typeof response === "object") {
          let pharmacyArray = [];
          for (let i = 0; i < response.length; i++) {
            pharmacyArray.push(response[i].Record);
          }
          setAllPharmacies(pharmacyArray);
        }
        payloadSchema.dataType = "Laboratory";
        response = await axios.post(ADDRESS + `getGenericData`, payloadSchema);
        response = response.data;
        console.log(response);
        console.log(typeof response);
        if (typeof response === "object") {
          let laboratoryArray = [];
          for (let i = 0; i < response.length; i++) {
            laboratoryArray.push(response[i].Record);
          }
          setAllLaboratories(laboratoryArray);
        }
        setLoaded(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPharmaciesAndLaboratoriesData();
  }, []);

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
        console.log(EHRSchema);
        doctor.listType = "appointments";
        doctor.assetId = event.target.value;
        response = await axios.post(ADDRESS + `readIndividualAsset`, doctor);
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
    } else if (event.target.name === "EHR") {
      console.log(event.target.files[0].name);
      setSelectedEHRFile(event.target.files[0]);
    } else if (event.target.name === "pharmacyId") {
      setPharmacy(event.target.value);
    } else if (event.target.name === "laboratoryId") {
      setLaboratory(event.target.value);
    }
    console.log("asd");
  };

  const uploadEHR = async (event) => {
    event.preventDefault();

    let response = "";
    try {
      let data = new FormData();
      data.append("file", selectedEHRFile, selectedEHRFile.name);
      data.append("appointmentId", EHRSchema.appointmentId);
      data.append("hospitalId", EHRSchema.hospitalId);
      data.append("patientId", EHRSchema.patientId);
      data.append("doctorId", EHRSchema.doctorId);
      data.append("time", new Date().toLocaleString());
      data.append("documentType", EHRSchema.documentType);
      data.append("sessionKey", doctor.sessionKey);
      data.append("pharmacyId", pharmacy);
      data.append("laboratoryId", laboratory);

      setLoaded(true);
      response = await axios.post(ADDRESS + `generateEHR`, data);
      setLoaded(false);
      response = response.data;
      if (response === "Correct") {
        manageAppointmentDisplay();
        setSelectedEHRFile("");
        setAppointmentId("");
        setAppointment(appointmentFormat);
      } else {
        console.log(response);
      }
    } catch (e) {
      //show error message
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

  function createLaboratoryMenuItems() {
    console.log("hert");
    console.log(allLaboratories);
    let items = [];
    for (let i = 0; i < allLaboratories.length; i++) {
      items.push(
        <MenuItem key={i} value={allLaboratories[i].registrationId}>
          {allLaboratories[i].registrationId +
            " " +
            allLaboratories[i].laboratoryType}
        </MenuItem>
      );
    }
    return items;
  }

  function createPharmacyMenuItems() {
    console.log("hert");
    console.log(allPharmacies);
    let items = [];
    for (let i = 0; i < allPharmacies.length; i++) {
      items.push(
        <MenuItem key={i} value={allPharmacies[i].registrationId}>
          {allPharmacies[i].registrationId}
        </MenuItem>
      );
    }
    return items;
  }

  function createLaboratoryMenuItems() {
    console.log("hert");
    console.log(allLaboratories);
    let items = [];
    for (let i = 0; i < allLaboratories.length; i++) {
      items.push(
        <MenuItem key={i} value={allLaboratories[i].registrationId}>
          {allLaboratories[i].registrationId +
            " " +
            allLaboratories[i].laboratoryType}
        </MenuItem>
      );
    }
    return items;
  }

  function createPharmacyMenuItems() {
    console.log("hert");
    console.log(allPharmacies);
    let items = [];
    for (let i = 0; i < allPharmacies.length; i++) {
      items.push(
        <MenuItem key={i} value={allPharmacies[i].registrationId}>
          {allPharmacies[i].registrationId}
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
          <Title>Upload EHR</Title>
          <form style={form} onSubmit={uploadEHR}>
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
                  defaultValue={EHRSchema.appointmentId}
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
                    Time: {appointment.time}
                    <br />
                    Description : {appointment.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Pharmacy"
                    name="pharmacyId"
                    autoComplete="pharmacyId"
                    classes={{ root: classes.root }}
                    defaultValue={pharmacy || ""}
                    onChange={handleChange}
                  >
                    {createPharmacyMenuItems()}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Laboratory"
                    name="laboratoryId"
                    autoComplete="laboratoryId"
                    classes={{ root: classes.root }}
                    defaultValue={laboratory || ""}
                    onChange={handleChange}
                  >
                    {createLaboratoryMenuItems()}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    color="primary"
                  >
                    Choose EHR
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                      name="EHR"
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    {selectedEHRFile === ""
                      ? chosenFilename
                      : selectedEHRFile.name}
                  </Typography>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={submit}
                >
                  Upload EHR
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
