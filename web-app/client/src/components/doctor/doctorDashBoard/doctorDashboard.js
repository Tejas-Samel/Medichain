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
import DoctorPersonalInfo from './doctorPersonalInfo';
import ExitToApp from "@material-ui/icons/ExitToApp";
import {Redirect} from "react-router-dom";
import axios from "axios";
import { ADDRESS,HEADER_MOBILE,HEADER_DESKTOP } from "../../genericFiles/constants";
import copyright from '../../genericFiles/copyright';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GenerateEHR from "./generateEHR";
import RequestDocumentAccess from "../../genericFiles/requestDocumentsAccess";
import ViewPatientDocuments from "../../genericFiles/viewPatientDocuments";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        backgroundColor:"#006597",
        backdropFilter:"blur(10px)",
        minHeight: HEADER_MOBILE,
        [theme.breakpoints.up('lg')]: {
            minHeight: HEADER_DESKTOP,
            // padding: theme.spacing(0, 8),
        },
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        paddingTop: HEADER_DESKTOP/4,
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
var doctorFormat = {
    DOB: '',
    aadhaar: '',
    address: '',
    appointments: [],
    currentHospital: '',
    firstName: '',
    gender: '',
    id: '',
    lastName: '',
    medicalRegistrationNo: '',
    patients: [],
    patientsAttended: [],
    phone: '',
    sessionKey: '',
    specialisation: '',
    type: 'Doctor',
    userName: ''
};

export default function DoctorDashBoard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [doctorData, setDoctorData] = React.useState(doctorFormat);
    const [loaded, setLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [logOut, setLogOut] = React.useState(false);
    const [doctorInfoDisplay, setDoctorInfoDisplay] = React.useState(false);
    const [generateEHRDisplay, setGenerateEHRDisplay] = React.useState(false);
    const [requestAccessDisplay, setRequestAccessDisplay] = React.useState(false);
    const [viewDocumentsDisplay, setViewDocumentsDisplay] = React.useState(false);

    useEffect(() => {
        const fetchDoctorData = async () => {
            setLoaded(true);
            try {
                let doctorCredentials = JSON.parse(localStorage.getItem('doctorToken'));
                console.log(doctorCredentials);
                if (!doctorCredentials) {
                    setLogOut(true); //need to change to true ***IMPORTANT***
                } else {
                    doctorCredentials.type = "Doctor";
                    console.log(doctorCredentials);
                    let response = await axios.post(ADDRESS + `readAsset`, doctorCredentials);
                    if (response !== null) {
                        response = response.data;
                        console.log(response);
                        response = JSON.parse(response);
                        response.sessionKey = doctorCredentials.sessionKey;
                        console.log(response);
                        setDoctorData(response || {});
                    }
                }
            } catch (e) {
                setLoaded(false);
                console.log(e);
            }
            setLoaded(false);
        };
        fetchDoctorData();
    }, []);
    console.log(doctorData + 1);

    const handleLogOut = async () => {
        console.log("herer");
        setLoaded(true);
        try {
            let doctorCredentials = JSON.parse(localStorage.getItem('doctorToken'));
            doctorCredentials.id = doctorCredentials.medicalRegistrationNo;
            setLoaded(true);
            let response = await axios.post(ADDRESS + `logOut`, doctorCredentials);
            setLoaded(false);
            response = response.data;
            console.log(response);
            if (response === 'Correct') {
                setLogOut(true);
                localStorage.removeItem("doctorToken");
            } else {
                //handle the failure by a error message stating why it failed
            }
        } catch (e) {
            
            console.log(e);
            //handle the error by giving out a error messeage saying the logOUt failed
        }
        setLoaded(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const visibilityHandlerDoctorInfo = () => {
        var x = document.getElementById("doctorInfo");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setDoctorInfoDisplay(true);
            } else {
                x.style.display = "none";
                setDoctorInfoDisplay(false);
            }
        }
    };
    const visibilityHandlerGenerateEHR = () => {
        var x = document.getElementById("generateEHR");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setGenerateEHRDisplay(true);
            } else {
                x.style.display = "none";
                setGenerateEHRDisplay(false);
            }
        }
    };
    const visibilityHandlerRequestAccess = () => {
        var x = document.getElementById("requestAccess");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setRequestAccessDisplay(true);
            } else {
                x.style.display = "none";
                setRequestAccessDisplay(false);
            }
        }
    };
    const visibilityHandlerViewDocuments = () => {
        var x = document.getElementById("viewDocuments");
        if (x) {
            if (x.style.display === "none") {
                x.style.display = "block";
                setViewDocumentsDisplay(true);
            } else {
                x.style.display = "none";
                setViewDocumentsDisplay(false);
            }
        }
    };

    console.log("Display");
    if (doctorInfoDisplay) {
        console.log("here");
        var doctorInfo = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <DoctorPersonalInfo data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    } else if (generateEHRDisplay) {
        console.log("there");
        var generateEHR = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <GenerateEHR data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    } else if (requestAccessDisplay) {
        console.log("nowhere");
        var requestAccess = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <RequestDocumentAccess data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    } else if (viewDocumentsDisplay) {
        console.log("here there");
        var viewDocuments = (
            <Paper className={fixedHeightPaper} style={{height: '360'}}>
                <ViewPatientDocuments data={JSON.stringify(doctorData)}/>
            </Paper>
        );
    }

    const mainListItems = (
        <div>
            <ListItem button onClick={visibilityHandlerDoctorInfo}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="DoctorDashBoard"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerGenerateEHR}>
                <ListItemIcon>
                    <NoteAddIcon/>
                </ListItemIcon>
                <ListItemText primary="Generate EHR"/>
            </ListItem>
            <ListItem button onClick={visibilityHandlerRequestAccess}>
                <ListItemIcon>
                    <FileCopyIcon/>
                </ListItemIcon>
                <ListItemText primary="Request Documents"/>
            </ListItem>
        </div>
    );
    const secondaryListItems = (
        <div>
            <ListSubheader inset>Shared Reports</ListSubheader>
            <ListItem button onClick={visibilityHandlerViewDocuments}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="View Reports"/>
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
                        Doctor Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={visibilityHandlerDoctorInfo}>
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
            <div style={{height:HEADER_DESKTOP}}>
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
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
                        {/*Recent DoctorPersonalInfo */}
                        <Grid item xs={12} style={{display: 'none'}} id="doctorInfo">
                            {doctorInfo}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="generateEHR">
                            {generateEHR}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="requestAccess">
                            {requestAccess}
                        </Grid>
                        <Grid item xs={12} style={{display: 'none'}} id="viewDocuments">
                            {viewDocuments}
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