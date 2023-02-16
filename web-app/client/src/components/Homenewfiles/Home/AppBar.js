import React, { Component } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import logo from "../../stockImages/logo.png";
import Typography from "@material-ui/core/Typography";
import "./assets/css/main.css";



class AppBar extends Component {

  render() {
    return (
      <header className="header">
        <div className="navbar-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">

                <Navbar bg="#5864FF" expand="lg" style={{position:"sticky",top:0}}>

                  <Container fluid>
                    <Navbar.Brand href="#home">
                      <img
                        src={logo}
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                        alt="Medichain"
                      />
                    </Navbar.Brand>
                    <Navbar.Brand href="/"><Typography variant="h4" className="text-light ">MediChain</Typography></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end" >
                      <Nav
                        // className="me-auto my-2 my-lg-0" 
                        style={{ maxHeight: '100px',backgroundColor:"#5864FF"  }}
                        navbarScroll
                      >
                        <Nav.Link href="/patientlogin">
                          <Typography variant="h6" className="text-light" >LogIn</Typography>
                          </Nav.Link>
                        <Nav.Link href="/registerPatient" className="text-light">
                        <Typography variant="h6" className="text-light" > Signup</Typography>
                          </Nav.Link>

                        
                      </Nav>

                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default AppBar;




