import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../HomeFiles/Typography';
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const styles = (theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: '#FFFAF5',
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        display: 'flex',
        position: 'relative',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
    },
});

function ProjectInfo(props) {
    const {classes} = props;

    return (

        <section className={classes.root}>

            <Container className={classes.container}>

                <Grid container spacing={5} align={"center"}>
                    <Grid item xs={12}>
                        <Typography component="p" variant="h4" color="#000000" gutterBottom align='center'>
                            <b>Insight</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Privacy
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        The stored data remains private for every user and can only be access by that
                                        particular user. Patients can only contact other stakeholders and not the other
                                        way around. The patient can choose to withdraw all access from all others.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Security
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        The documents are stored in the mongo cloud and the hash value is calculated for
                                        every document. The hash value is stored in the blockchain network which is used
                                        to verify whenever the document is accessed by any of the stakeholders.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Full Health Cycle
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        The entire health cycle can be imitated from booking an appointment to going to
                                        the doctor and then generation of various documents such as EHRs,
                                        reports, receipts and bills. Every document is stored and transaction is
                                        submitted to network.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Access Control
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Whenever a document is generated it is digitally signed by the creator and then
                                        the access is transferred to the patient. Furhtermore the stakeholders can
                                        request for the document which initiates a transaction and patient can either
                                        accept or reject the request.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Various Stakeholders
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        From patients to hospitals, doctors to laboratories and pharmacies every aspect
                                        of the healthcare is covered and even the researchers and insurance are included
                                        in order to provide a wholesome experience to the user.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.root} style={{height: 350}}>
                            <CardActionArea>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Interactive UI
                                </Typography>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Every user gets a dashboard through which it can perform transactions. From
                                        generating and requesting documents, booking an appointment, assignment of
                                        doctors, laboratories to creation of bill. All the users can perform operation
                                        through the responsive UI.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
}

ProjectInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectInfo);