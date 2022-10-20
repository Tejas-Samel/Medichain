import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../HomeFiles/Typography';

const styles = (theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: '#FFF9F5',
    },
    container: {
        marginTop: theme.spacing(15),
        marginBottom: theme.spacing(10),
        display: 'flex',
        position: 'relative',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
    },
    image: {
        height: 55,
    },
    title: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    curvyLines: {
        pointerEvents: 'none',
        position: 'absolute',
        top: -180,
    },
});

function TechStackInfo(props) {
    const {classes} = props;

    return (
        <section className={classes.root}>
            <Container className={classes.container}>
                <img
                    src={require("../stockImages/curvyLines.png")}
                    className={classes.curvyLines}
                    alt="curvy lines"
                />

                <Grid container spacing={5} align={"center"}>

                    <Grid item xs={12} md={3}>
                        <div className={classes.item}>
                            <img
                                className={classes.image}
                                src={require("../stockImages/hyperledgerFabric.png")}
                                alt="Hyperledger"
                            />
                            <Typography variant="h5" className={classes.title}>
                                HyperledgerFabric
                            </Typography>
                            <Typography variant="h6">
                                {"The project's blockchain network uses fabric for transactions and management of peers. " +
                                "It offers a unique approach to consensus that enables performance at scale while preserving privacy."}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <div className={classes.item} align={"center"}>
                            <img
                                className={classes.image}
                                src={require("../stockImages/reactApp.png")}
                                alt="React"
                            />
                            <Typography variant="h5" className={classes.title}>
                                React App
                            </Typography>
                            <Typography variant="h6">
                                {'React is a JavaScript library for building user interfaces.The userInterface of the project' +
                                'uses react for the interaction with the blockchain network.'}

                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <div className={classes.item} align={"center"}>
                            <img
                                className={classes.image}
                                src={require("../stockImages/nodejs.png")}
                                alt="Nodejs"
                            />
                            <Typography variant="h5" className={classes.title}>
                                NodeJs
                            </Typography>
                            <Typography variant="h6">
                                {'Node.js is an open-source, cross-platform, JavaScript runtime environment ' +
                                'that executes JavaScript code outside of a web browser.' +
                                'The server of the project uses express app to interact directly with the network.'}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <div className={classes.item} align={"center"}>
                            <img
                                className={classes.image}
                                src={require("../stockImages/mongo.png")}
                                alt="MongoDB"
                            />
                            <Typography variant="h5" className={classes.title}>
                                MongoDB
                            </Typography>
                            <Typography variant="h6">
                                {'MongoDB Atlas is the global cloud database for modern applications that is distributed ' +
                                'and secure by default and available as a fully managed service on various clouds.' +
                                'The records are stored in mongoDB and hashed which is stored in blockchain network.'}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}

TechStackInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TechStackInfo);