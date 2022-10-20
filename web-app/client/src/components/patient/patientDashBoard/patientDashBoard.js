import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PersonIcon from '@material-ui/icons/Person';
import PatientPersonalInfo from './patientPersonalInfo';
import ExitToApp from "@material-ui/icons/ExitToApp";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {ADDRESS} from "../../genericFiles/constants";
import copyright from '../../genericFiles/copyright';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import {AddIcCallSharp} from "@material-ui/icons";
import BookHospitalAppointment from "./bookHospitalAppointment";
import ManageFileAccess from "./manageFileAccess";
import ViewEHRs from "./viewEHRs";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import ViewLabRecords from "./viewLabRecords";
import ViewMedicineRecipts from "./viewMedicineReceipts";
import ViewBills from "./viewBills";
import InsuranceClaim from "./insuranceClaim";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: '100%',
    },
}));
var patientFormat = {
    DOB: '',
    aadhaar: '',
    address: '',
    appointments: [],
    bills: [],
    bloodGroup: '',
    ehrs: [],
    emergencyContacts: [],
    firstName: '',
    gender: '',
    labRecords: [],
    lastName: '',
    medicineReceipts: [],
    permissionedIds: {},
    phone: '',
    requesters: [],
    type: 'Patient',
    userName: '',
    sessionKey: '',
};

export default function PatientDashBoard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [patientData, setPatientData] = React.useState(patientFormat);
    const [loaded, setLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [logOut, setLogOut] = React.useState(false);
    const [patientInfoDisplay, setPatientInfoDisplay] = React.useState(false);
    const [bookAppointmentDisplay, setBookAppointmentDisplay] = React.useState(false);
    const [requesterDisplay, setRequesterDisplay] = React.useState(false);
    const [insuranceClaimDisplay, setInsuranceClaimDisplay] = React.useState(false);
    const [viewEHRsDisplay, setViewEHRsDisplay] = React.useState(false);
    const [viewLabRecordsDisplay, setViewLabRecordsDisplay] = React.useState(false);
    const [viewMedicineReceiptsDisplay, setViewMedicineReceiptsDisplay] = React.useState(false);
    const [viewBillsDisplay, setViewBillsDisplay] = React.useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            setLoaded(true);
            try {
                let patientCredentials = JSON.parse(localStorage.getItem('patientToken'));
                if (!patientCredentials) {
                    setLogOut(true);
                } else {
                    patientCredentials.type = "Patient";
                    console.log(patientCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, patientCredentials);
                    if (response !== null) {
                        response = response.data;
                        response = JSON.parse(response);
                        response.sessionKey = patientCredentials.sessionKey;
                        console.log(response);
                        setPatientData(response || {});
                    }
                }
            } catch (e) {
                console.log(e);
            }
            setLoaded(false);
        };
        fetchPatientData();
    }, []);
    console.log(patientData);

    const handleLogOut = async () => {
        console.log("herer");
        setLoaded(true);
        try {
            let patientCredentials = JSON.parse(localStorage.getItem('patientToken'));
            patientCredentials.id = patientCredentials.userName;
            let response = await axios.post(ADDRESS + `logOut`, patientCredentials);
            response = response.data;
            console.log(response);
            if (response === 'Correct') {
                setLogOut(true);
                localStorage.removeItem("patientToken");
            } else {
                //handle the failure by a error message stating why it failed
            }
        } catch (e) {
            //handle the error by giving out a error messeage saying the logOUt failed
            console.log(e);
        }
        setLoaded(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const visibilityHandlerPatientInfo = () => {
        var x = document.getElementById("patientInfo");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setPatientInfoDisplay(true);
            } else {
                x.style.display = "none";
                setPatientInfoDisplay(false);
            }
        }
    };
    const visibilityHandlerBookAppointment = () => {
        var x = document.getElementById("bookAppointment");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setBookAppointmentDisplay(true);
            } else {
                x.style.display = "none";
                setBookAppointmentDisplay(false);
            }
        }
    };
    const visibilityHandlerRequesters = () => {
        var x = document.getElementById("fileAccess");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setRequesterDisplay(true);
            } else {
                x.style.display = "none";
                setRequesterDisplay(false);
            }
        }
    };
    const visibilityHandlerInsuranceClaim = () => {
        var x = document.getElementById("insuranceClaim");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setInsuranceClaimDisplay(true);
            } else {
                x.style.display = "none";
                setInsuranceClaimDisplay(false);
            }
        }
    };
    const visibilityHandlerViewEHRs = () => {
        var x = document.getElementById("viewEHRs");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setViewEHRsDisplay(true);
            } else {
                x.style.display = "none";
                setViewEHRsDisplay(false);
            }
        }
    };
    const visibilityHandlerViewLabRecords = () => {
        console.log("insidre");
        var x = document.getElementById("viewLabRecords");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setViewLabRecordsDisplay(true);
            } else {
                x.style.display = "none";
                setViewLabRecordsDisplay(false);
            }
        }
    };
    const visibilityHandlerViewMedicineReceipts = () => {
        console.log("hssdf");
        var x = document.getElementById("viewMedicineReceipts");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setViewMedicineReceiptsDisplay(true);
            } else {
                x.style.display = "none";
                setViewMedicineReceiptsDisplay(false);
            }
        }
    };
    const visibilityHandlerViewBills = () => {
        console.log("insdfsdfsidre");
        var x = document.getElementById("viewBills");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setViewBillsDisplay(true);
            } else {
                x.style.display = "none";
                setViewBillsDisplay(false);
            }
        }
    };

    console.log(patientInfoDisplay);
    if (patientInfoDisplay) {
        console.log("here");
        var patientInfo = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <PatientPersonalInfo data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (bookAppointmentDisplay) {
        var bookAppointment = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <BookHospitalAppointment data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (requesterDisplay) {
        var fileAccess = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ManageFileAccess data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (insuranceClaimDisplay) {
        var insuranceClaim = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <InsuranceClaim data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (viewEHRsDisplay) {
        var viewEHRs = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ViewEHRs data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (viewLabRecordsDisplay) {
        console.log("Lab Records");
        var viewLabRecords = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ViewLabRecords data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (viewMedicineReceiptsDisplay) {
        console.log("Medicine Reciepts");
        var viewMedicineReceipts = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ViewMedicineRecipts data={JSON.stringify(patientData)}/>
            </Paper>
        );
    } else if (viewBillsDisplay) {
        console.log("Bills");
        var viewBills = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ViewBills data={JSON.stringify(patientData)}/>
            </Paper>
        );
    }

    const mainListItems = (
        <div>
            <ListItem button onClick={visibilityHandlerPatientInfo}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="PatientDashBoard"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerBookAppointment}>
                <ListItemIcon>
                    <AddIcCallSharp/>
                </ListItemIcon>
                <ListItemText primary="Book Appointment"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerRequesters}>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Requesters"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ContactPhoneIcon/>
                </ListItemIcon>
                <ListItemText primary="Emergency Contacts"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerInsuranceClaim}>
                <ListItemIcon>
                    <MonetizationOnIcon/>
                </ListItemIcon>
                <ListItemText primary="Insurance Claim"/>
            </ListItem>
        </div>
    );
    const secondaryListItems = (
        <div>
            <ListSubheader inset>Saved Documents</ListSubheader>
            <ListItem button onClick={visibilityHandlerViewEHRs}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="View EHRs"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerViewLabRecords}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="View Lab Reports"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerViewMedicineReceipts}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="View Medicine Receipt"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerViewBills}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="View Bills"/>
            </ListItem>
        </div>
    );

    if (logOut) {
        return <Redirect to={{
            pathname: '/',
        }}/>;
    }

    return (
        <div className={classes.root} id='mainDiv'>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Patient Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={visibilityHandlerPatientInfo}>
                        <PersonIcon/>
                    </IconButton>
                    <IconButton color="secondary" onClick={handleLogOut}>
                        <ExitToApp/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>{mainListItems}</List>
                <Divider/>
                <List>{secondaryListItems}</List>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>

                    <Grid container spacing={3} justify='center' alignContent='center'>
                        {/* Recent HospitalPersonalInfo */}
                        <Grid item xs={12} style={{display: 'none'}} id="patientInfo">
                            {patientInfo}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="bookAppointment">
                            {bookAppointment}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="fileAccess">
                            {fileAccess}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="insuranceClaim">
                            {insuranceClaim}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="viewEHRs">
                            {viewEHRs}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="viewLabRecords">
                            {viewLabRecords}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="viewMedicineReceipts">
                            {viewMedicineReceipts}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="viewBills">
                            {viewBills}
                        </Grid>

                    </Grid>
                    <Box pt={4}>
                        <copyright.Copyright/>
                    </Box>
                </Container>
            </main>
            <SpinnerDialog open={loaded}/>
        </div>
    );
}