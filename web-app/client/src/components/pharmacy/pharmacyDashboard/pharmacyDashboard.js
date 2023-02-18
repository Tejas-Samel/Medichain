import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonIcon from "@material-ui/icons/Person";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { ADDRESS } from "../../genericFiles/constants";
import copyright from "../../genericFiles/copyright";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RequestDocumentAccess from "../../genericFiles/requestDocumentsAccess";
import ViewPatientDocuments from "../../genericFiles/viewPatientDocuments";
import SpinnerDialog from "../../genericFiles/SpinnerDialog";
import PharmacyInfo from "./pharmacyInfo";
import GenerateMedicineReceipt from "./generateMedicineReceipt";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "100%",
  },
}));
var pharmacyFormat = {
  appointments: [],
  hospitalId: "",
  registrationId: "",
  patients: [],
  patientsAttended: [],
  phone: "",
  sessionKey: "",
  type: "Pharmacy",
  userName: "",
};

export default function PharmacyDashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [pharmacyData, setPharmacyData] = React.useState(pharmacyFormat);
  const [loaded, setLoaded] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [logOut, setLogOut] = React.useState(false);
  const [pharmacyInfoDisplay, setPharmacyInfoDisplay] = React.useState(false);
  const [generateMedicineReceiptDisplay, setGenerateMedicineReceiptDisplay] =
    React.useState(false);
  const [requestAccessDisplay, setRequestAccessDisplay] = React.useState(false);
  const [viewDocumentsDisplay, setViewDocumentsDisplay] = React.useState(false);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      setLoaded(true);
      try {
        let pharmacyCredentials = JSON.parse(
          localStorage.getItem("pharmacyToken")
        );
        console.log(pharmacyCredentials);
        if (!pharmacyCredentials) { //change to pharmacyCredentials
          setLogOut(true);
        } else {
          pharmacyCredentials.type = "Pharmacy";
          console.log(pharmacyCredentials);
          let response = await axios.post(
            ADDRESS + `readAsset`,
            pharmacyCredentials
          );
          if (response !== null) {
            response = response.data;
            console.log(response);
            response = JSON.parse(response);
            response.sessionKey = pharmacyCredentials.sessionKey;
            console.log(response);
            setPharmacyData(response || {});
          }
        }
      } catch (e) {
        console.log(e);
      }
      setLoaded(false);
    };
    fetchPharmacyData();
  }, []);
  console.log(pharmacyData + 1);

  const handleLogOut = async () => {
    console.log("herer");
    setLoaded(true);
    try {
      let pharmacyCredentials = JSON.parse(
        localStorage.getItem("pharmacyToken")
      );
      pharmacyCredentials.id = pharmacyCredentials.registrationId;
      let response = await axios.post(ADDRESS + `logOut`, pharmacyCredentials);
      response = response.data;
      console.log(response);
      if (response === "Correct") {
        setLogOut(true);
        localStorage.removeItem("pharmacyToken");
      } else {
        //handle the failure by a error message stating why it failed
      }
    } catch (e) {
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

  const visibilityHandlerPharmacyInfo = () => {
    var x = document.getElementById("pharmacyInfo");
    if (x) {
      if (x.style.display === "none") {
        x.style.display = "block";
        setPharmacyInfoDisplay(true);
      } else {
        x.style.display = "none";
        setPharmacyInfoDisplay(false);
      }
    }
  };
  const visibilityHandlerGenerateMedicineReceipt = () => {
    var x = document.getElementById("generateMedicineReceipt");
    if (x) {
      if (x.style.display === "none") {
        x.style.display = "block";
        setGenerateMedicineReceiptDisplay(true);
      } else {
        x.style.display = "none";
        setGenerateMedicineReceiptDisplay(false);
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

  console.log(pharmacyInfoDisplay);
  if (pharmacyInfoDisplay) {
    console.log("here");
    var pharmacyInfo = (
      <Paper className={fixedHeightPaper} style={{ height: "360" }}>
        <PharmacyInfo data={JSON.stringify(pharmacyData)} />
      </Paper>
    );
  } else if (generateMedicineReceiptDisplay) {
    console.log("there");
    var generateMedicineReceipt = (
      <Paper className={fixedHeightPaper} style={{ height: "360" }}>
        <GenerateMedicineReceipt data={JSON.stringify(pharmacyData)} />
      </Paper>
    );
  } else if (requestAccessDisplay) {
    console.log("nowhere");
    var requestAccess = (
      <Paper className={fixedHeightPaper} style={{ height: "360" }}>
        <RequestDocumentAccess data={JSON.stringify(pharmacyData)} />
      </Paper>
    );
  } else if (viewDocumentsDisplay) {
    console.log("here there");
    var viewDocuments = (
      <Paper className={fixedHeightPaper} style={{ height: "360" }}>
        <ViewPatientDocuments data={JSON.stringify(pharmacyData)} />
      </Paper>
    );
  }

  const mainListItems = (
    <div>
      <ListItem button onClick={visibilityHandlerPharmacyInfo}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="PharmacyDashBoard" />
      </ListItem>
      <ListItem button onClick={visibilityHandlerGenerateMedicineReceipt}>
        <ListItemIcon>
          <NoteAddIcon />
        </ListItemIcon>
        <ListItemText primary="Generate MedicineReceipt" />
      </ListItem>
      <ListItem button onClick={visibilityHandlerRequestAccess}>
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText primary="Request Documents" />
      </ListItem>
    </div>
  );
  const secondaryListItems = (
    <div>
      <ListSubheader inset>Shared Reports</ListSubheader>
      <ListItem button onClick={visibilityHandlerViewDocuments}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="View Reports" />
      </ListItem>
    </div>
  );

  if (logOut) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }

  return (
    <div className={classes.root} id="mainDiv">
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Pharmacy Dashboard
          </Typography>
          <IconButton color="inherit" onClick={visibilityHandlerPharmacyInfo}>
            <PersonIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleLogOut}>
            <ExitToApp />
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
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} justify="center" alignContent="center">
            {/*Recent PharmacyPersonalInfo */}
            <Grid item xs={12} style={{ display: "none" }} id="pharmacyInfo">
              {pharmacyInfo}
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "none" }}
              id="generateMedicineReceipt"
            >
              {generateMedicineReceipt}
            </Grid>
            <Grid item xs={12} style={{ display: "none" }} id="requestAccess">
              {requestAccess}
            </Grid>
            <Grid item xs={12} style={{ display: "none" }} id="viewDocuments">
              {viewDocuments}
            </Grid>
          </Grid>
          <Box pt={4}>
            <copyright.Copyright />
          </Box>
        </Container>
      </main>
      <SpinnerDialog open={loaded} />
    </div>
  );
}
