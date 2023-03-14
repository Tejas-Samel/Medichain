import React, { Component } from 'react';
import Typography from '@mui/material/Typography';
import { Button,Stack } from '@mui/material';




// import all the images
import patient from "./assets/loginicons/patient.png";
import doctor from "./assets/loginicons/doctor.png";
import hospital from "./assets/loginicons/hospital.png";
import pharmacy from "./assets/loginicons/pharmacy.png";
import laboratory from "./assets/loginicons/laboratory.png";
import research from "./assets/loginicons/research.png";
import insurance from "./assets/loginicons/insurance.png";




class Sectiontwo extends Component {
    state = {}
    render() {
        return (
            <section id="features" className="feature-section pt-100 pb-120">

                <div className="container bg-light">
                    <div className="row justify-content-center border-bottom border-top">
                        <div className="col-lg-3 col-md-8 col-sm-10   border-end">
                            <div className="single-feature ">
                                <div className="icon">
                                    <img src={patient} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Patient</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/patientLogin'>login</Button>
                                    <Button variant="outlined" href='/registerPatient' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-8 col-sm-10 border-end ">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={doctor} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Doctor</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/doctorLogin' >login</Button>
                                    <Button variant="outlined" href='/registerDoctor' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-8 col-sm-10 border-end">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={hospital} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Hospital</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/HospitalLogin'>login</Button>
                                    <Button variant="outlined" href='/registerHospital'>signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-8 col-sm-10 ">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={pharmacy} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Pharmacy</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/pharmacyLogin'>login</Button>
                                    <Button variant="outlined" href='/registerPharmacy' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row justify-content-center">
                        
                        <div className="col-lg-3 col-md-8 col-sm-10 border-end border-bottom ">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={laboratory} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Laboratory</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/laboratoryLogin' >login</Button>
                                    <Button variant="outlined" href='/registerLaboratory' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-8 col-sm-10 border-end border-bottom ">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={research} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Research</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/researcherLogin' >login</Button>
                                    <Button variant="outlined" href='/registerResearcher' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-8 col-sm-10  border-bottom ">
                            <div className="single-feature">
                                <div className="icon">
                                    <img src={insurance} />
                                </div>
                                <div className="content ">
                                    <Typography variant='h4'>Insurance</Typography>
                                    <Stack spacing={2} direction="row" className='justify-content-center mt-3'>
                                    <Button variant="contained" href='/insuranceLogin'>login</Button>
                                    <Button variant="outlined" href='/registerInsurance' >signup</Button>
                                    </Stack>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        );
    }
}

export default Sectiontwo;








