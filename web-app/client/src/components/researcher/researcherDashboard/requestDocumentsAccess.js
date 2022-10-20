import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {ADDRESS} from "../../genericFiles/constants";
import axios from "axios";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import Title from "../../genericFiles/Title";

export default function RequestDocumentAccess(props) {
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [loaded, setLoaded] = React.useState(false);
    const [specificPatientDetails, setSpecificPatientDetails] = React.useState('');

    const handleChange = (event) => {
        event.preventDefault();
        setSpecificPatientDetails(event.target.value);
    };

    const submitRequest = async (event) => {
        event.preventDefault();
        setLoaded(true);
        let requestSchema = {
            requesterId: updatedData.registrationId,
            sessionKey: updatedData.sessionKey,
            patientId: ''
        };
        try {
            let response = {};
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

            console.log(requestSchema);
            if (requestSchema.patientId) {
                response = await axios.post(ADDRESS + `requestAccess`, requestSchema);
                response = response.data;
                if (response === 'Correct') {
                    setSpecificPatientDetails('');
                } else {
                    console.log(response);
                }
            }
            setSpecificPatientDetails('');
        } catch (e) {
            console.log(e);
        }
        setLoaded(false);
    };

    return (
        <React.Fragment>
            <div align='center'>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div align={'center'}><Title>Request Patients</Title></div>
                    <Grid container spacing={4}>
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
                    </Grid>
                </Container>
            </div>
            <SpinnerDialog open={loaded}/>
        </React.Fragment>
    );
}