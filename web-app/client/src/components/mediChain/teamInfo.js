import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "../HomeFiles/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Box } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
    backgroundColor: "#FFFFF5",
  },
  container: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    display: "flex",
    position: "relative",
    padding: theme.spacing(5),
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 5),
  },
  media: {
    height: 280,
  },
});

function TeamInfo(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Grid
          container={"main"}
          direction={"column"}
          spacing={2}
          alignItems={"center"}
        >
          <Grid container spacing={5} align={"center"} justify={"center"}>
            <Grid item xs={12}>
              <Typography
                component="p"
                variant="h4"
                color="#000000"
                gutterBottom
                align="center"
              >
                <b>Contributors</b>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.root} style={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../stockImages/profile.png")}
                    title="Name"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Name
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (Title)
                      <br />
                      Department of Computer Engineering, BVCOE, Navi Mumbai
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.root} style={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../stockImages/profile.png")}
                    title="Saurabh N. Patil"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Saurabh N. Patil
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (19121040)
                      <br />
                      Department of Computer Engineering, BVCOE, Navi Mumbai
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.root} style={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../stockImages/profile.png")}
                    title="Tejas N. Samel"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Tejas N. Samel
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (191210__)
                      <br />
                      Department of Computer Engineering, BVCOE, Navi Mumbai
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.root} style={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../stockImages/profile.png")}
                    title="Gaurav K. Pawar"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Gaurav K. Pawar
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (191210__)
                      <br />
                      Department of Computer Engineering, BVCOE, Navi Mumbai
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.root} style={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={require("../stockImages/profile.png")}
                    title="Prathamesh M. Patil"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Prathamesh M. Patil
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (19121039)
                      <br />
                      Department of Computer Engineering, BVCOE, Navi Mumbai
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

TeamInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeamInfo);
