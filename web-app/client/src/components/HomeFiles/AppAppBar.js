import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import AppBar from "./AppBar";
import Toolbar, { styles as toolbarStyles } from "./Toolbar";
import { Container, NavbarBrand, Navbar, Nav, NavItem, NavbarToggler, Collapse } from 'reactstrap';


const styles = (theme) => ({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.palette.common.white,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  rightLink: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

const appbarstyles = {
  // background: "rgba(0,0,0,0.9)",
  padding: "0 5px",
  boxShadow: "0px",
  width: "100%",
  height: "80px",
  borderRadius: "15px",
}

function AppAppBar(props) {
  const { classes } = props;
  return (
    <div className="topbar" id="top">
      <div className="header6">
        <Container className="po-relative">
          <Navbar className="navbar-expand-lg h6-nav-bar">
            <NavbarBrand href="/"><img src="" alt="wrapkit" /></NavbarBrand>
            <NavbarToggler onClick=""><span className="ti-menu"></span></NavbarToggler>
            <Collapse isOpen="" navbar className="hover-dropdown font-14 ml-auto" id="h6-info">
              <Nav navbar className="ml-auto">
                <NavItem>
                  <Link className="nav-link" to={"/components"}>
                    Components
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to={"/custom-components"}>
                    Custom-Components
                  </Link>
                </NavItem>
              </Nav>
              <div className="act-buttons">
                <Link to="/#coming" className="btn btn-success-gradiant font-14">Upgrade To Pro</Link>
              </div>
            </Collapse>
          </Navbar>
        </Container>
      </div>
    </div>
  );
}


//   return (
//     <div>
//       <AppBar position="fixed" style={appbarstyles}>
//         <Toolbar className={classes.toolbar}>
//           <div className={classes.left} />
//           <Link
//             variant="h6"
//             underline="none"
//             color="inherit"
//             className={classes.title}
//             href="/"
//           >
//             {"MEDICHAIN"}
//           </Link>
//           <div className={classes.right}>
//             <Link
//               color="inherit"
//               variant="h6"
//               underline="none"
//               className={classes.rightLink}
//               href="/patientlogin"
//             >
//               {"SIGN IN"}
//             </Link>
//             <Link
//               variant="h6"
//               underline="none"
//               className={clsx(classes.rightLink, classes.linkSecondary)}
//               href="/registerPatient"
//             >
//               {"SIGN UP"}
//             </Link>
//           </div>
//         </Toolbar>
//       </AppBar>
//       <div className={classes.placeholder} />
//     </div>
//   );
// }

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);
