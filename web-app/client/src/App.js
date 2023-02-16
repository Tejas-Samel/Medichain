import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Landingpage from './components/Homenewfiles/Home/Landingpage';

// import Landpage from "./components/Homefilesnew/src/Landpage";
import patientLogin from "./components/patient/patientLogin";
import registerPatient from "./components/patient/registerPatient";
import MediChain from "./components/mediChain/mediChain";
import registerDoctor from "./components/doctor/registerDoctor";
import doctorLogin from "./components/doctor/doctorLogin";
import hospitalLogin from "./components/hospital/hospitalLogin";
import registerHospital from "./components/hospital/registerHospital";
import patientDashBoard from "./components/patient/patientDashBoard/patientDashBoard";
import hospitalDashBoard from "./components/hospital/hospitalDashBoard/hospitalDashBoard";
import Dashboard from "./components/DashBoard/DashBoard";
import doctorDashboard from "./components/doctor/doctorDashBoard/doctorDashboard";
import registerLaboratory from "./components/laboratory/registerLaboratory";
import laboratoryLogin from "./components/laboratory/laboratoryLogin";
import laboratoryDashboard from "./components/laboratory/laboratoryDashboard/laboratoryDashboard";
import registerPharmacy from "./components/pharmacy/registerPharmacy";
import pharmacyLogin from "./components/pharmacy/pharmacyLogin";
import pharmacyDashboard from "./components/pharmacy/pharmacyDashboard/pharmacyDashboard";
import registerResearcher from "./components/researcher/registerResearcher";
import researcherLogin from "./components/researcher/reseracherLogin";
import registerInsurance from "./components/insurance/registerInsurance";
import insuranceLogin from "./components/insurance/insuranceLogin";
import researcherDashboard from "./components/researcher/researcherDashboard/researcherDashboard";
import insuranceDashboard from "./components/insurance/insuranceDashboard/insuranceDashboard";
class App extends Component {
  render() {
    return (
      <div >
        <Router>
          <Route path="/" exact component={Landingpage} />
          <Route path="/mediChain" exact component={MediChain} />
          <Route path="/patientLogin" exact component={patientLogin} />
          <Route path="/registerPatient" exact component={registerPatient} />
          <Route path="/registerDoctor" exact component={registerDoctor} />
          <Route path="/doctorLogin" exact component={doctorLogin} />
          <Route path="/registerHospital" exact component={registerHospital} />
          <Route path="/HospitalLogin" exact component={hospitalLogin} />
          <Route path="/patientDashBoard" exact component={patientDashBoard} />
          <Route
            path="/hospitalDashBoard"
            exact
            component={hospitalDashBoard}
          />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/doctorDashBoard" exact component={doctorDashboard} />
          <Route
            path="/registerLaboratory"
            exact
            component={registerLaboratory}
          />
          <Route path="/laboratoryLogin" exact component={laboratoryLogin} />
          <Route
            path="/laboratoryDashBoard"
            exact
            component={laboratoryDashboard}
          />
          <Route path="/registerPharmacy" exact component={registerPharmacy} />
          <Route path="/pharmacyLogin" exact component={pharmacyLogin} />
          <Route
            path="/pharmacyDashBoard"
            exact
            component={pharmacyDashboard}
          />
          <Route
            path="/registerResearcher"
            exact
            component={registerResearcher}
          />
          <Route path="/researcherLogin" exact component={researcherLogin} />
          <Route
            path="/researcherDashBoard"
            exact
            component={researcherDashboard}
          />
          <Route
            path="/registerInsurance"
            exact
            component={registerInsurance}
          />
          <Route path="/insuranceLogin" exact component={insuranceLogin} />
          <Route
            path="/insuranceDashboard"
            exact
            component={insuranceDashboard}
          />
        </Router>
      </div>
    );
  }
}

export default App;
