import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Container from "@material-ui/core/Container";
import Typography from "./Typography";
import { Redirect } from "react-router-dom";
import { Hidden } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
    padding: "20px",
    backgroundColor: "#000000",
    background: "transparent",
  },
  container: {
    padding: "20px",
    position: "relative",
  },
  title: {
    backgroundColor: "#000000",
    marginBottom: theme.spacing(5),
    color: "#B8F6F9",
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    padding: "20px",
  },
  imageWrapper: {
    position: "relative",
    display: "block",
    padding: 0,
    borderRadius: 0,
    height: "40vh",
    [theme.breakpoints.down("sm")]: {
      width: "100% !important",
      height: 100,
    },
    "&:hover": {
      zIndex: 1,
    },
    "&:hover $imageBackdrop": {
      opacity: 0.15,
    },
    "&:hover $imageMarked": {
      opacity: 0,
    },
    "&:hover $imageTitle": {
      border: "4px solid currentColor",
    },
  },
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
});

function ProductCategories(props) {
  const { classes } = props;
  const [redirectLink, setRedirectLink] = React.useState("");
  const images = [
    {
      url: require("../stockImages/patient.jpg"),
      // 'http://images.indulgexpress.com/uploads/user/imagelibrary/2017/11/20/original/cancer_patient.jpg',
      title: "Patient",
      width: "60%",
    },
    {
      url: require("../stockImages/doctor-1.jpg"),
      // 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.XbjUsLa610Gq-GZg7IhMHAHaE8%26pid%3DApi&f=1',
      title: "Doctor",
      width: "40%",
    },
    {
      url: require("../stockImages/hospital-1.jpg"),
      // 'https://media.istockphoto.com/photos/hospital-building-exterior-and-hospital-sign-picture-id610220632?k=6&m=610220632&s=612x612&w=0&h=M9gF0wh2c491diYWwI_we6qeC01U0t2opLU59Dh-RP8=',
      title: "Hospital",
      width: "40%",
    },
    {
      url: require("../stockImages/pharmacy.jpg"),
      // 'https://www.statnews.com/wp-content/uploads/2016/11/AP_04031606125-1024x576.jpg',
      title: "Pharmacy",
      width: "30%",
    },
    {
      url: require("../stockImages/laboratory.webp"),
      // 'https://www.usa.philips.com/c-dam/b2bhc/master/Products/Category/magnetic-resonance/imaging-systems-thumb.jpg',
      title: "Laboratory",
      width: "30%",
    },
    {
      url: require("../stockImages/insurance.jpg"),
      // 'http://insurancelovers.com/wp-content/uploads/2014/08/Images-Health-Insurance-HD-Wallpaper.jpg',
      title: "Insurance",
      width: "60%",
    },
    {
      url: require("../stockImages/future-1-min.jpg"),
      // 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.CSReQVt2BfpydidGp28CygHaE8%26pid%3DApi&f=1',
      title: "Researcher",
      width: "40%",
    },
  ];

  function redirectToUser(user) {
    console.log("here");
    setRedirectLink("/register" + user);
    console.log(redirectLink);
  }

  return redirectLink !== "" ? (
    <Redirect to={redirectLink} />
  ) : (
    <section className={classes.root}>
      <Container className={classes.container} component="section">
        <Typography
          variant="h4"
          marked="center"
          align="center"
          component="h2"
          className={classes.title}
        >
          <b>FOR YOUR EVERY HEALTH NEEDS, WE GOT YOU COVERED!</b>
        </Typography>
        <div className={classes.images}>
          {images.map((image) => (
            <ButtonBase
              key={image.title}
              className={classes.imageWrapper}
              style={{
                width: image.width,
              }}
              onClick={() => redirectToUser(image.title)}
            >
              <div
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
              <div className={classes.imageBackdrop} />
              <div className={classes.imageButton}>
                <Typography
                  component="h3"
                  variant="h6"
                  color="inherit"
                  className={classes.imageTitle}
                >
                  {image.title}
                  <div className={classes.imageMarked} />
                </Typography>
              </div>
            </ButtonBase>
          ))}
        </div>
      </Container>
    </section>
  );
}

ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);
