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

export default function GenerateBill(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [selectedBillFile, setSelectedBillFile] = React.useState("");
  const [BillSchema, setBillSchema] = React.useState({
    patientId: "",
    hospitalId: updatedData.registrationId,
    doctorId: "",
    pharmacyId: "none",
    laboratoryId: "none",
    documentType: "Bill",
    amount: "",
  });

  let chosenFilename = "No File Selected";
  console.log(updatedData);

  const manageFormDisplay = () => {
    var x = document.getElementById("formDisplay");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

  const handleChange = async (event) => {
    event.preventDefault();
    if (event.target.name === "Bill") {
      console.log(event.target.files[0].name);
      setSelectedBillFile(event.target.files[0]);
    } else if (event.target.name === "pharmacyId") {
      BillSchema.pharmacyId = event.target.value;
      setBillSchema(BillSchema);
    } else if (event.target.name === "laboratoryId") {
      BillSchema.laboratoryId = event.target.value;
      setBillSchema(BillSchema);
    } else if (event.target.name === "doctorId") {
      BillSchema.doctorId = event.target.value;
      setBillSchema(BillSchema);
    } else if (event.target.name === "patientId") {
      BillSchema.patientId = event.target.value;
      setBillSchema(BillSchema);
      manageFormDisplay();
    } else if (event.target.name === "amount") {
      BillSchema.amount = event.target.value;
      setBillSchema(BillSchema);
    }
    console.log("asd");
  };

  const uploadBill = async (event) => {
    event.preventDefault();

    let response = "";
    try {
      let data = new FormData();
      data.append("file", selectedBillFile, selectedBillFile.name);
      data.append("hospitalId", BillSchema.hospitalId);
      data.append("patientId", BillSchema.patientId);
      data.append("doctorId", BillSchema.doctorId);
      data.append("time", new Date().toLocaleString());
      data.append("documentType", BillSchema.documentType);
      data.append("sessionKey", updatedData.sessionKey);
      data.append("pharmacyId", BillSchema.pharmacyId);
      data.append("laboratoryId", BillSchema.laboratoryId);
      data.append("amount", BillSchema.amount);

      setLoaded(true);
      response = await axios.post(ADDRESS + `generateBill`, data);
      setLoaded(false);
      response = response.data;
      if (response === "Correct") {
        manageFormDisplay();
        setSelectedBillFile("");
        setBillSchema({
          patientId: "",
          hospitalId: updatedData.registrationId,
          doctorId: "",
          pharmacyId: "",
          laboratoryId: "",
          documentType: "Bill",
          amount: "",
        });
      } else {
        console.log(response);
      }
    } catch (e) {
      setLoaded(false);
      console.log(e);
    }
  };

  function createPatientMeuItems() {
    console.log("Patient Menu Items");
    console.log(updatedData.remainingPatientBills);
    let allPatients = updatedData.remainingPatientBills;
    let items = [];
    for (let i = 0; i < allPatients.length; i++) {
      items.push(
        <MenuItem key={i} value={allPatients[i]}>
          {localStorage.getItem(allPatients[i])}
        </MenuItem>
      );
    }
    return items;
  }

  function createDoctorMenuItems() {
    console.log("Doctor Menu Items");
    console.log(updatedData.doctors);
    let allDoctors = updatedData.doctors;
    let items = [];
    for (let i = 0; i < allDoctors.length; i++) {
      items.push(
        <MenuItem key={i} value={allDoctors[i]}>
          {localStorage.getItem(allDoctors[i])}
        </MenuItem>
      );
    }
    return items;
  }

  function createLaboratoryMenuItems() {
    console.log("hert");
    console.log(updatedData.laboratories);
    let allLaboratories = updatedData.laboratories;
    let items = [];
    for (let i = 0; i < allLaboratories.length; i++) {
      items.push(
        <MenuItem key={i} value={allLaboratories[i]}>
          {localStorage.getItem(allLaboratories[i])}
        </MenuItem>
      );
    }
    return items;
  }

  function createPharmacyMenuItems() {
    console.log("hert");
    console.log(updatedData.pharmacies);
    let allPharmacies = updatedData.pharmacies;
    let items = [];
    for (let i = 0; i < allPharmacies.length; i++) {
      items.push(
        <MenuItem key={i} value={allPharmacies[i]}>
          {allPharmacies[i]}
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
          <Title>Upload Bill</Title>
          <form style={form} onSubmit={uploadBill}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  id="select"
                  label="Patient"
                  name="patientId"
                  autoComplete="patient"
                  classes={{ root: classes.root }}
                  defaultValue={BillSchema.patientId}
                  onChange={handleChange}
                >
                  {createPatientMeuItems()}
                </TextField>
              </Grid>
            </Grid>
            <div id="formDisplay" style={{ display: "none" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Doctor"
                    name="doctorId"
                    autoComplete="doctorId"
                    classes={{ root: classes.root }}
                    defaultValue={BillSchema.doctorId || ""}
                    onChange={handleChange}
                  >
                    {createDoctorMenuItems()}
                  </TextField>
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
                    defaultValue={BillSchema.pharmacyId || ""}
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
                    defaultValue={BillSchema.laboratoryId || ""}
                    onChange={handleChange}
                  >
                    {createLaboratoryMenuItems()}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="amount"
                    label="Total Amount"
                    name="amount"
                    autoComplete="amount"
                    defaultValue={BillSchema.amount || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    color="primary"
                  >
                    Choose Bill
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                      name="Bill"
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    {selectedBillFile === ""
                      ? chosenFilename
                      : selectedBillFile.name}
                  </Typography>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={submit}
                >
                  Upload Bill
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
