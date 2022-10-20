import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import axios from "axios";
import {ADDRESS} from "./constants";
import Title from "./Title";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import SpinnerDialog from "./SpinnerDialog";

const useStyles = makeStyles(theme => ({
    root: {},
}));

function SimpleDialog(props) {
    const {onClose, imageURL, open, documentInfo} = props;

    const handleClose = () => {
        onClose(imageURL);
    };
    return (
        <Dialog onClose={handleClose} scroll={'body'} aria-labelledby="simple-dialog-title" open={open}>
            <DialogContent>
                <DialogTitle id="simple-dialog-title" style={{textAlign: "center"}}>
                    <b>Hospital:</b> {localStorage.getItem(documentInfo.hospitalId)}<br/>
                    <b>Doctor:</b> {localStorage.getItem(documentInfo.doctorId)}<br/>
                    <b>Date:</b> {documentInfo.time}<br/>
                    <b>DocumentType:</b> {documentInfo.type}
                </DialogTitle>
                <img src={imageURL} alt="rahul parihar"
                     width="100%" height="60%"/>
            </DialogContent>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    imageURL: PropTypes.string.isRequired,
    documentInfo: PropTypes.object.isRequired,
};

export default function ViewPatientDocuments(props) {
    const classes = useStyles();
    const [updatedData, setUpdatedData] = React.useState(JSON.parse(props.data));
    const [loaded, setLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [patientAndDocumentDetails, setPatientAndDocumentDetails] = React.useState([]);
    const [documentId, setDocumentId] = React.useState('');
    const [currentDocument, setCurrentDocument] = React.useState({});
    const [imageURL, setImageURL] = React.useState('');

    useEffect(() => {
        const fetchPatientAndDocumentData = async () => {
            try {
                setLoaded(true);
                let payloadSchema = {
                    sessionKey: updatedData.sessionKey,
                    listType: 'patients',
                    patients: updatedData.patients,
                    type: updatedData.type
                };
                if (updatedData.type === 'Doctor') {
                    payloadSchema.medicalRegistrationNo = updatedData.medicalRegistrationNo;
                } else {
                    payloadSchema.registrationId = updatedData.registrationId;
                }
                let response = await axios.post(ADDRESS + `readIndividualAsset`, payloadSchema);
                response = response.data;
                console.log(typeof response);
                if (typeof response === 'object') {
                    setPatientAndDocumentDetails(response);
                }
                setLoaded(false);
            } catch (e) {
                console.log(e);
            }
        };
        fetchPatientAndDocumentData();
    }, []);

    function createMenuItems(patientInfo) {
        console.log("creteMenuItems");
        let items = [];
        for (let i = 1; i < patientInfo.length; i++) {
            let documentId = (patientInfo[i].ehrId || patientInfo[i].billId || patientInfo[i].labRecordId || patientInfo[i].medicineReceiptId);
            items.push(
                <MenuItem key={i} value={documentId}>
                    {documentId}
                </MenuItem>);
        }
        return items;
    }

    async function displayDocument(patientCompleteInfo) {
        let documentInfo = {};
        for (let i = 1; i < patientCompleteInfo.length; i++) {
            let localDocumentId = (patientCompleteInfo[i].ehrId || patientCompleteInfo[i].billId || patientCompleteInfo[i].labRecordId || patientCompleteInfo[i].medicineReceiptId);
            if (documentId === localDocumentId) {
                documentInfo = patientCompleteInfo[i];
                break;
            }
        }
        console.log(documentInfo);
        console.log("display Document");
        try {
            let fileSchema = {
                documentId: (documentInfo.ehrId || documentInfo.billId || documentInfo.labRecordId || documentInfo.medicineReceiptId),
                type: documentInfo.type,
                patientId: documentInfo.patientId,
            };
            await axios.post(ADDRESS + `fetchFileFromDatabase`, fileSchema, {responseType: "blob"})
                .then(res => {
                    console.log(res);
                    let url = URL.createObjectURL(res.data);
                    console.log(url);
                    setImageURL(url);
                    setOpen(true);
                    setCurrentDocument(documentInfo);
                });
        } catch (e) {
            console.log(e);
        }
    }

    function handleChange(e) {
        e.preventDefault();
        console.log("handleChange");
        console.log(e.target.value);
        setDocumentId(e.target.value);
    }

    function createTableBody() {
        let rows = [];
        for (let i = 0; i < patientAndDocumentDetails.length; i++) {
            rows.push(<TableRow key={i}>
                <TableCell>{patientAndDocumentDetails[i][0].userName}</TableCell>
                <TableCell>{patientAndDocumentDetails[i][0].firstName + " " + patientAndDocumentDetails[i][0].lastName}</TableCell>
                <TableCell>{patientAndDocumentDetails[i][0].gender}</TableCell>
                <TableCell>{patientAndDocumentDetails[i][0].DOB}</TableCell>
                <TableCell>
                    <TextField variant="outlined"
                               required
                               fullWidth
                               select
                               id="select"
                               label="Choose"
                               name="documentId"
                               autoComplete="documentId"
                               classes={{root: classes.root}}
                               defaultValue={(documentId)}
                               onChange={handleChange}
                    >
                        {createMenuItems(patientAndDocumentDetails[i])}
                    </TextField>
                </TableCell>
                <TableCell align="right">
                    <Button name={i} onClick={() => displayDocument(patientAndDocumentDetails[i])}
                            variant="contained"
                            component="label"
                            fullWidth
                            color="primary">{'click here'}
                    </Button>
                </TableCell>
            </TableRow>);
        }
        console.log(rows);
        return rows;
    }

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <React.Fragment>
            <Title>Patients Documents</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}>Patient Id</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Patient Name</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Gender</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Date of Birth</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>Documents</TableCell>
                        <TableCell style={{fontWeight: 'bold'}}>View Documents</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createTableBody()}
                </TableBody>
            </Table>
            <SimpleDialog imageURL={imageURL} open={open} onClose={handleClose} documentInfo={currentDocument}/>
            <SpinnerDialog open={loaded}/>
        </React.Fragment>
    );
}