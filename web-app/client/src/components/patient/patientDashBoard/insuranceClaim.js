import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import Avatar from "@material-ui/core/Avatar";
import PublishIcon from "@material-ui/icons/Publish";
import Title from "../../genericFiles/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";

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

export default function InsuranceClaim(props) {
  const classes = useStyles();
  const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
  const [loaded, setLoaded] = React.useState(false);
  const [allInsurance, setAllInsurance] = React.useState([]);
  const [insuranceClaimSchema, setInsuranceClaimSchema] = React.useState({
    insuranceId: "",
    billId: "",
    ehrId: "",
    medicineReceiptId: "",
    labRecordId: "",
    patientId: "",
    documentIds: [],
  });

  useEffect(() => {
    const fetchInsurerData = async () => {
      setLoaded(true);
      try {
        let payloadSchema = {
          dataType: "Insurance",
        };
        let response = await axios.post(
          ADDRESS + `getGenericData`,
          payloadSchema
        );
        response = response.data;
        console.log(response);
        console.log(typeof response);
        if (typeof response === "object") {
          let insuranceArray = [];
          for (let i = 0; i < response.length; i++) {
            insuranceArray.push(response[i].Record);
          }
          setAllInsurance(insuranceArray);
        }
      } catch (e) {}
      setLoaded(false);
    };
    fetchInsurerData();
  }, []);

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
    insuranceClaimSchema[event.target.name] = event.target.value;
    if (event.target.name === "insuranceId") {
      manageFormDisplay();
    } else {
      insuranceClaimSchema.documentIds.push(event.target.value);
    }
    setInsuranceClaimSchema(insuranceClaimSchema);

    console.log("asd");
  };

  function createInsuranceMenuItems() {
    console.log("Insurance Menu Items");
    let items = [];
    for (let i = 0; i < allInsurance.length; i++) {
      items.push(
        <MenuItem key={i} value={allInsurance[i].registrationId}>
          {allInsurance[i].name}
        </MenuItem>
      );
    }
    return items;
  }

  function createDocumentMenuItems(documentType) {
    console.log(documentType);
    let allDocuments = updatedData[documentType];
    let items = [];
    for (let i = 0; i < allDocuments.length; i++) {
      items.push(
        <MenuItem key={i} value={allDocuments[i]}>
          {allDocuments[i]}
        </MenuItem>
      );
    }
    return items;
  }

  const submitClaim = async (event) => {
    event.preventDefault();
    setLoaded(true);
    try {
      let payloadSchema = {
        sessionKey: updatedData.sessionKey,
        patientId: updatedData.userName,
        requesterId: insuranceClaimSchema.insuranceId,
        documentIds: insuranceClaimSchema.documentIds,
        requestType: "direct",
      };
      let response = await axios.post(ADDRESS + `grantAccess`, payloadSchema);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        setInsuranceClaimSchema({
          insuranceId: "",
          billId: "",
          ehrId: "",
          medicineReceiptId: "",
          labRecordId: "",
          patientId: "",
          documentIds: [],
        });
      }
      manageFormDisplay();
    } catch (e) {
      console.log(e);
    }
    setLoaded(false);
  };

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={paper}>
          <Avatar style={avatar}>
            <PublishIcon />
          </Avatar>
          <Title>Insurance Claim</Title>
          <form style={form} onSubmit={submitClaim}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  id="select"
                  label="Insurance"
                  name="insuranceId"
                  autoComplete="insuranceId"
                  classes={{ root: classes.root }}
                  defaultValue={insuranceClaimSchema.insuranceId}
                  onChange={handleChange}
                >
                  {createInsuranceMenuItems()}
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
                    label="EHRs"
                    name="ehrId"
                    autoComplete="ehrId"
                    classes={{ root: classes.root }}
                    defaultValue={insuranceClaimSchema.ehrId || ""}
                    onChange={handleChange}
                  >
                    {createDocumentMenuItems("ehrs")}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="Bills"
                    name="billId"
                    autoComplete="billId"
                    classes={{ root: classes.root }}
                    defaultValue={insuranceClaimSchema.billId || ""}
                    onChange={handleChange}
                  >
                    {createDocumentMenuItems("bills")}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="LabRecords"
                    name="labRecordId"
                    autoComplete="labRecordId"
                    classes={{ root: classes.root }}
                    defaultValue={insuranceClaimSchema.labRecordId || ""}
                    onChange={handleChange}
                  >
                    {createDocumentMenuItems("labRecords")}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    select
                    id="select"
                    label="MedicineReceipts"
                    name="medicineReceiptId"
                    autoComplete="medicineReceiptId"
                    classes={{ root: classes.root }}
                    defaultValue={insuranceClaimSchema.medicineReceiptId || ""}
                    onChange={handleChange}
                  >
                    {createDocumentMenuItems("medicineReceipts")}
                  </TextField>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={submit}
                >
                  Submit Claim
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
