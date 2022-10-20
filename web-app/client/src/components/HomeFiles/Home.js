import React, {Component} from 'react';
import ProductCategories from "./ProductCategories";
import AppAppBar from "./AppAppBar";
import ProductHero from "./ProductHero";
import ProductValues from "./ProductValues";
import AppFooter from "./AppFooter";

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <AppAppBar/>
                <ProductHero/>
                <ProductValues/>
                <ProductCategories/>
                <AppFooter/>
            </React.Fragment>
        );
    }
}

export default Home;