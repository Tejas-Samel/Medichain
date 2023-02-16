import React, {Component} from 'react';
import ProductCategories from "./ProductCategories";
import AppAppBar from "./AppAppBar";
import ProductHero from "./ProductHero";
import ProductValues from "./ProductValues";
import AppFooter from "./AppFooter";

// import HeaderBanner from "../Homefilesnew/banner"
// import Header from "../Homefilesnew/header"


class Home extends Component {
    render() {
        return (
            <React.Fragment>
                {/* <Header/> */}
                {/* <HeaderBanner/>                 */}
                <ProductHero/>
                <ProductValues/>
                <ProductCategories/>
                <AppFooter/>
            </React.Fragment>
        );
    }
}

export default Home;