import React, {useEffect} from "react";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import axios from "axios";
import {ADDRESS} from "../../genericFiles/constants";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";

const useStyles = makeStyles(theme => ({
    root: {},
}));

export default function ManageFileAccess(props) {
    const classes = useStyles();
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [loaded, setLoaded] = React.useState(false);
    const [mode, setMode] = React.useState('grantAccess');
    const [requesterDetails, setRequesterDetails] = React.useState([]);
    const [permissionedDetails, setPermissionedDetails] = React.useState([]);
    const [requesterTableDisplay, setRequesterTableDisplay] = React.useState(true);
    const [permissionedTableDisplay, setPermissionedTableDisplay] = React.useState(false);
    const [documentIds, setDocumentIds] = React.useState([]);
    const [menuItems, setMenuItems] = React.useState([]);

    useEffect(() => {
        const fetchFileAccessingUsersData = async () => {
            setLoaded(true);
            try {
                let payloadSchema = {
                    listType: 'requesters',
                    requesters: updatedData.requesters,
                    sessionKey: updatedData.sessionKey,
                    type: 'Patient',
                    userName: updatedData.userName
                };
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setRequesterDetails(response || []);
                    setMenuItems(createMenuItems());
                }
                delete payloadSchema.requesters;
                console.log(Object.keys(updatedData.permissionedIds));
                payloadSchema.permissionedIds = Object.keys(updatedData.permissionedIds);
                payloadSchema.listType = 'permissionedIds';
                response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(response);
                if (typeof response === 'object') {
                    setPermissionedDetails(response || []);
                }
            } catch (e) {
                console.log(e);
            }
            setLoaded(false);
        };
        fetchFileAccessingUsersData();
    }, []);

    const handleMode = async (event, newMode) => {
        console.log(newMode);
        if (newMode === null) {
            setRequesterTableDisplay(false);
            setPermissionedTableDisplay(false);
        } else if (newMode === 'grantAccess') {
            setRequesterTableDisplay(true);
            setPermissionedTableDisplay(false);
        } else {
            setRequesterTableDisplay(false);
            setPermissionedTableDisplay(true);
        }
        setMode(newMode);
    };

    console.log(requesterTableDisplay);
    var requesterTable = requesterTableDisplay ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Requester Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Requester Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Requester Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Select Document</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Grant Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createRequestersTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    var permissionedTable = permissionedTableDisplay ? (
        <Grid item xs={12}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>PermissionedUser Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>PermissionedUser Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>PermissionedUser Type</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Documents</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Revoke Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createPermissionedTableBody()}
                </TableBody>
            </Table>
        </Grid>
    ) : (<div/>);

    function createMenuItems() {
        console.log("hert");
        let combinedDocumentIds = [];
        combinedDocumentIds = combinedDocumentIds.concat(updatedData.ehrs);
        combinedDocumentIds = combinedDocumentIds.concat(updatedData.labRecords);
        combinedDocumentIds = combinedDocumentIds.concat(updatedData.medicineReceipts);
        combinedDocumentIds = combinedDocumentIds.concat(updatedData.bills);

        console.log(combinedDocumentIds);
        let items = [];
        for (let i = 0; i < combinedDocumentIds.length; i++) {
            items.push(<MenuItem
                key={i}
                value={combinedDocumentIds[i]}>{combinedDocumentIds[i]}</MenuItem>);
        }
        return items;
    }

    function handleChange(e) {
        console.log("here");
        console.log(e.target.value);
        setDocumentIds(e.target.value);
    }

    async function submitRequest(requesterId) {
        setLoaded(true);
        try {
            let payloadSchema = {
                sessionKey: updatedData.sessionKey,
                patientId: updatedData.userName,
                requesterId: requesterId,
            };
            if (permissionedTableDisplay) {
                let response = await axios.post(ADDRESS + `revokeAccess`, payloadSchema);
                response = response.data;
                console.log(response);
                if (response === 'Correct') {
                    delete updatedData.permissionedIds[requesterId];
                }
            } else if (requesterTableDisplay) {
                payloadSchema.requestType = "channeled";
                payloadSchema.documentIds = documentIds;
                let response = await axios.post(ADDRESS + `grantAccess`, payloadSchema);
                response = response.data;
                console.log(response);
                if (response === 'Correct') {
                    let index = updatedData.requesters.indexOf(requesterId);
                    if (index > -1) {
                        updatedData.requesters.splice(index, 1);
                    }
                    if ((requesterDetails[index].registrationId || requesterDetails[index].medicalRegistrationNo) === requesterId) {
                        requesterDetails.splice(index, 1);
                        setRequesterDetails(requesterDetails);
                    }
                    setDocumentIds([]);
                }
            }
        } catch (e) {
            console.log(e);
        }
        setLoaded(false);
    }

    function permissionedIdsDocumentMenuItems(documentArray) {
        console.log("im herre");
        let items = [];
        for (let i = 0; i < documentArray.length; i++) {
            items.push(<MenuItem
                key={i}
                value={documentArray[i]}>{documentArray[i]}</MenuItem>);
        }
        return items;
    }

    function createRequestersTableBody() {
        let rows = [];
        for (let i = 0; i < requesterDetails.length; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCell>{(requesterDetails[i].registrationId) || requesterDetails[i].medicalRegistrationNo}</TableCell>
                    <TableCell>{(requesterDetails[i].name) || (requesterDetails[i].firstName + requesterDetails[i].lastName) || (requesterDetails[i].userName)}</TableCell>
                    <TableCell>{requesterDetails[i].type}</TableCell>
                    <TableCell>
                        <TextField variant="outlined"
                                   required
                                   fullWidth
                                   select
                                   id="select"
                                   label="Select Document Ids"
                                   name="documentIds"
                                   autoComplete="documentIds"
                                   classes={{root: classes.root}}
                                   defaultValue={documentIds || []}
                                   onChange={handleChange}
                                   SelectProps={{
                                       multiple: true,
                                   }}
                        >
                            {menuItems}
                        </TextField>
                    </TableCell>
                    <TableCell><Button name={i}
                                       onClick={() => submitRequest((requesterDetails[i].registrationId || requesterDetails[i].medicalRegistrationNo))}
                                       variant="contained"
                                       component="label"
                                       fullWidth
                                       color="primary">{'Submit'}
                    </Button></TableCell>
                </TableRow>
            );
        }
        console.log(rows);
        return rows;
    }

    function createPermissionedTableBody() {
        let rows = [];
        for (let i = 0; i < permissionedDetails.length; i++) {
            rows.push(<TableRow key={i}>
                <TableCell>{(permissionedDetails[i].registrationId || permissionedDetails[i].medicalRegistrationNo)}</TableCell>
                <TableCell>{(permissionedDetails[i].name) || (permissionedDetails[i].firstName + permissionedDetails[i].lastName) || permissionedDetails[i].userName}</TableCell>
                <TableCell>{permissionedDetails[i].type}</TableCell>
                <TableCell>
                    <TextField variant="outlined"
                               required
                               fullWidth
                               select
                               id="select"
                               label="Check Documents"
                               name="documentIds"
                               autoComplete="documentIds"
                               classes={{root: classes.root}}
                               defaultValue={updatedData.permissionedIds[(permissionedDetails[i].registrationId || permissionedDetails[i].medicalRegistrationNo)]}
                    >
                        {permissionedIdsDocumentMenuItems(updatedData.permissionedIds[(permissionedDetails[i].registrationId || permissionedDetails[i].medicalRegistrationNo)] || [])}
                    </TextField>
                </TableCell>
                <TableCell><Button name={i}
                                   onClick={() => submitRequest((permissionedDetails[i].registrationId || permissionedDetails[i].medicalRegistrationNo))}
                                   variant="contained"
                                   component="label"
                                   fullWidth
                                   color="primary">{'Submit'}
                </Button></TableCell>
            </TableRow>);
        }
        console.log(rows);
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
                                <ToggleButton value="grantAccess" aria-label="Grant Document Access">
                                    Grant Access
                                </ToggleButton>
                                <ToggleButton value="revokeAccess" aria-label="Revoke Document Access">
                                    Revoke Access
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    {requesterTable}
                    {permissionedTable}
                </Container>
            </div>
            <SpinnerDialog open={loaded}/>
        </React.Fragment>
    );
}
