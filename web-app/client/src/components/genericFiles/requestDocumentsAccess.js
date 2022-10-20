import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {ADDRESS} from "./constants";
import axios from "axios";
import SpinnerDialog from "./SpinnerDialog";

const useStyles = makeStyles(theme => ({
    root: {},
}));

export default function RequestDocumentAccess(props) {
    const classes = useStyles();
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [loaded, setLoaded] = React.useState(false);
    const [mode, setMode] = React.useState('localList');
    const [attendedPatientDisplay, setAttendedPatientDisplay] = React.useState(true);
    const [specificPatientDisplay, setSpecificPatientDisplay] = React.useState(false);
    const [specificPatientDetails, setSpecificPatientDetails] = React.useState('');
    const [attendedPatientDetails, setAttendedPatientDetails] = React.useState('');

    const handleMode = async (event, newMode) => {
        console.log(newMode);
        if (newMode === null) {
            setAttendedPatientDisplay(false);
            setSpecificPatientDisplay(false);
        } else if (newMode === 'localList') {
            setAttendedPatientDisplay(true);
            setSpecificPatientDisplay(false);
        } else {
            setAttendedPatientDisplay(false);
            setSpecificPatientDisplay(true);
        }
        setMode(newMode);
    };

    function createMenuItems() {
        console.log("hert");
        let items = [];
        let patientsAttended = updatedData.patientsAttended || updatedData.patientsVisited;
        console.log(patientsAttended);
        for (let i = 0; i < patientsAttended.length; i++) {
            items.push(<MenuItem
                key={i}
                value={patientsAttended[i]}>{patientsAttended[i]}</MenuItem>);
        }
        console.log(items);
        return items;
    }

    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.name === 'patientAttendedId') {
            setAttendedPatientDetails(event.target.value);
        } else if (event.target.name === 'specificPatientId') {
            setSpecificPatientDetails(event.target.value);
        }
    };

    const submitRequest = async (event) => {
        event.preventDefault();
        setLoaded(true);
        let requestSchema = {
            requesterId: updatedData.medicalRegistrationNo || updatedData.registrationId,
            sessionKey: updatedData.sessionKey,
            patientId: ''
        };
        try {
            let response = {};
            if (specificPatientDisplay) {
                requestSchema.id = specificPatientDetails;
                requestSchema.patientId = specificPatientDetails;
                requestSchema.query = 'single';
                console.log(requestSchema);
                response = await axios.post(ADDRESS + `fetchUsersFromDatabase`, requestSchema);
                response = response.data;
                console.log(response);
                if (response.userId !== requestSchema.id) {
                    requestSchema.patientId = '';
                }
                delete requestSchema.query;
                delete requestSchema.id;
            } else if (attendedPatientDisplay) {
                requestSchema.patientId = attendedPatientDetails;
            }
            console.log(requestSchema);
            if (requestSchema.patientId) {
                response = await axios.post(ADDRESS + `requestAccess`, requestSchema);
                response = response.data;
                if (response === 'Correct') {
                    setSpecificPatientDetails('');
                    setAttendedPatientDetails('');
                } else {
                    console.log(response);
                }
            }
            setAttendedPatientDetails('');
            setSpecificPatientDetails('');
        } catch (e) {
            console.log(e);
        }
        setLoaded(false);
    };

    var attendedPatient = attendedPatientDisplay ? (
        <Grid item xs={12}>
            <TextField variant="outlined"
                       required
                       fullWidth
                       select
                       id="select"
                       label="Patients Attended"
                       name="patientAttendedId"
                       autoComplete="patientAttendedId"
                       classes={{root: classes.root}}
                       defaultValue={attendedPatientDetails}
                       onChange={handleChange}
            >
                {createMenuItems()}
            </TextField>
        </Grid>
    ) : (<div/>);

    var specificPatient = specificPatientDisplay ? (
        <Grid item xs={12}>
            <TextField
                autoComplete="specificPatientId"
                name="specificPatientId"
                variant="outlined"
                required
                fullWidth
                id="specificPatientId"
                label="PatientId"
                onChange={handleChange}
                defaultValue={specificPatientDetails}
            />
        </Grid>
    ) : (<div/>);

    var displayButton = (specificPatientDisplay || attendedPatientDisplay) ? (
        <Grid item xs={12}>
            <Button xs={12}
                    name='submitButton'
                    onClick={submitRequest}
                    variant="contained"
                    component="label"
                    fullWidth
                    color="primary">{'Submit Request'}
            </Button>
        </Grid>
    ) : (<div/>);

    return (
        <React.Fragment>
            <div align='center'>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <ToggleButtonGroup
                                size="large"
                                value={mode}
                                exclusive
                                onChange={handleMode}
                                aria-label="Request Type">
                                <ToggleButton value="localList" aria-label="Attended Patient Request">
                                    Attended Patients
                                </ToggleButton>
                                <ToggleButton value="userName" aria-label="Specific Patient Request">
                                    Specific Patient
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        {attendedPatient}
                        {specificPatient}
                        {displayButton}
                    </Grid>
                </Container>
            </div>
            <SpinnerDialog open={loaded}/>
        </React.Fragment>
    );
}