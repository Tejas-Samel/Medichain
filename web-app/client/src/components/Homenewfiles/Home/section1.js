import React, { Component } from 'react';

import Typography from "@material-ui/core/Typography";
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import heroimg from "./assets/img/hero/hero-img.png";

class Sectionfirst extends Component {
    state = {}
    render() {
        return (
            <section id="home" className="hero-section">
                <div className="container">
                    <div className="row align-items-center position-relative">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <Typography variant='h4' className="text-light pt-3 mt-3" gutterBottom>
                                    Organized, Accurate, Real-time Health Records.
                                </Typography>

                                <Typography paragraph className="text-light pt-5" >
                                    A comprehensive solution for organizing and accessing medical records in a seamless and efficient manner.
                                </Typography>
                                <Typography paragraph className="text-light  " gutterBottom>
                                    Empowering healthcare providers and patients with real-time access to accurate and up-to-date health information.
                                </Typography>
                                <a href="#features" className="scroll-bottom">
                                    <ArrowDownward /></a>

                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex flex-row-reverse" >
                                <img src={heroimg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Sectionfirst;