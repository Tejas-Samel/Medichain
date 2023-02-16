import React, { Component } from 'react';

import AppBar from './AppBar';
import Sectionfirst from './section1';
import Sectiontwo from './section2';
// import Sectionthree from './section3';
import Footer from './footer';


class Landingpage extends Component {
    state = {}
    render() {
        return (
            <div>
                <AppBar />
                <Sectionfirst />
                <Sectiontwo />
                {/* <Sectionthree /> */}
                <Footer />
                </div>
        );
    }
}

export default Landingpage;