import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {ADDRESS} from "../../genericFiles/constants";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {},
}));

export default function HospitalAssets(props) {
    const classes = useStyles();
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [loaded, setLoaded] = React.useState(false);
    const [mode, setMode] = React.useState(null);
    const [patientDetails, setPatientDetails] = React.useState([]);
    const [doctorDetails, setDoctorDetails] = React.useState([]);
    const [laboratoryDetails, setLaboratoryDetails] = React.useState([]);
    const [pharmacyDetails, setPharmacyDetails] = React.useState([]);
    const [assetDisplay, setAssetDisplay] = React.useState('');

    const handleMode = async (event, newMode) => {
        console.log(newMode);
        if (newMode !== null) {
            await fetchAssets(newMode);
        }
        setAssetDisplay(newMode !== null ? newMode : '');
        setMode(newMode);
    };

    async function apiCall(assetType) {
        try {
            let payloadSchema = {
                listType: assetType,
                sessionKey: updatedData.sessionKey,
                type: 'Hospital',
                registrationId: updatedData.registrationId
            };
            setLoaded(true);
            payloadSchema[assetType] = updatedData[assetType];
            let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
            setLoaded(false);
            response = response.data;
            if (typeof response === 'object') {
                return response;
            } else {
                return [];
            }
        } catch (e) {
            setLoaded(false);
            console.log(e);
        }
    }

    async function fetchAssets(assetType) {
        if (assetType === 'patients') {
            if (patientDetails.length === 0 && updatedData.patientsVisited.length !== 0) {
                let patientsData = await apiCall('patientsVisited');
                setPatientDetails(patientsData);
            }
        } else if (assetType === 'doctors') {
            if (doctorDetails.length === 0 && updatedData.doctors.length !== 0) {
                let doctorsData = await apiCall(assetType);
                setDoctorDetails(doctorsData);
            }
        } else if (assetType === 'pharmacies') {
            if (pharmacyDetails.length === 0 && updatedData.pharmacies.length !== 0) {
                let pharmaciesData = await apiCall(assetType);
                setPharmacyDetails(pharmaciesData);
            }
        } else if (assetType === 'laboratories') {
            if (laboratoryDetails.length === 0 && updatedData.laboratories.length !== 0) {
                let laboratoriesData = await apiCall(assetType);
                setLaboratoryDetails(laboratoriesData);
            }
        }
    }

    console.log(assetDisplay);
    var doctorTable = assetDisplay === 'doctors' ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Doctor Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Doctor Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Gender</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>DoB</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Specialisation</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createDoctorsTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    function createDoctorsTableBody() {
        let rows = [];
        for (let i = 0; i < doctorDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{doctorDetails[i].medicalRegistrationNo}</TableCell>
                    <TableCell>{(doctorDetails[i].firstName + ' ' + doctorDetails[i].lastName)}</TableCell>
                    <TableCell>{doctorDetails[i].gender}</TableCell>
                    <TableCell>{doctorDetails[i].DOB}</TableCell>
                    <TableCell>{doctorDetails[i].specialisation}</TableCell>
                    <TableCell>{doctorDetails[i].phone}</TableCell>
                </TableRow>
            );
        }
        return rows;
    }

    var patientTable = assetDisplay === 'patients' ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Patient Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Gender</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>DoB</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>BloodGroup</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createPatientsTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    function createPatientsTableBody() {
        let rows = [];
        for (let i = 0; i < patientDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{(patientDetails[i].firstName + ' ' + patientDetails[i].lastName)}</TableCell>
                    <TableCell>{patientDetails[i].gender}</TableCell>
                    <TableCell>{patientDetails[i].DOB}</TableCell>
                    <TableCell>{patientDetails[i].bloodGroup}</TableCell>
                    <TableCell>{patientDetails[i].phone}</TableCell>
                </TableRow>
            );
        }
        return rows;
    }

    var pharmacyTable = assetDisplay === 'pharmacies' ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Pharmacy Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Pharmacy UserName</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createPharmaciesTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    function createPharmaciesTableBody() {
        let rows = [];
        for (let i = 0; i < pharmacyDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{pharmacyDetails[i].registrationId}</TableCell>
                    <TableCell>{pharmacyDetails[i].userName}</TableCell>
                    <TableCell>{pharmacyDetails[i].phone}</TableCell>
                </TableRow>
            );
        }
        return rows;
    }

    var laboratoryTable = assetDisplay === 'laboratories' ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Laboratory Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Laboratory Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createLaboratoriesTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    function createLaboratoriesTableBody() {
        let rows = [];
        for (let i = 0; i < laboratoryDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{laboratoryDetails[i].registrationId}</TableCell>
                    <TableCell>{laboratoryDetails[i].userName}</TableCell>
                    <TableCell>{laboratoryDetails[i].laboratoryType}</TableCell>
                    <TableCell>{laboratoryDetails[i].phone}</TableCell>
                </TableRow>
            );
        }
        return rows;
    }

    return (
        <React.Fragment>
            <div align='center'>
                <Container component="main" maxWidth="xl">
                    <CssBaseline/>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ToggleButtonGroup
                                size="large"
                                value={mode}
                                exclusive
                                onChange={handleMode}
                                aria-label="Mode Selection">
                                <ToggleButton value="doctors" aria-label="Doctors">
                                    Doctors
                                </ToggleButton>
                                <ToggleButton value="laboratories" aria-label="Laboratories">
                                    Laboratories
                                </ToggleButton>
                                <ToggleButton value="pharmacies" aria-label="Pharmacies">
                                    Pharmacies
                                </ToggleButton>
                                <ToggleButton value="patients" aria-label="Patients">
                                    Patients
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    {doctorTable}
                    {patientTable}
                    {pharmacyTable}
                    {laboratoryTable}
                </Container>
            </div>
            <SpinnerDialog open={loaded}/>
        </React.Fragment>);
}