import React from "react";
import PropTypes from "prop-types";
import NoImg from "../images/no-img.png";
import withStyles from "@material-ui/core/styles/withStyles";
//Mui

import Paper from "@material-ui/core/Paper";

//icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";


const styles = theme => ({
  ...theme.spreadThis,
  handle : {
      height : 20,
      backgroundColor:theme.palette.primary.main,
      width : 60,
      margin : '0 auto 7px auto'
  },
  fulLine :{
      height : 15,
      backgroundColor :  'rgba(0,0,0,0.6)',
      width : "100%",
      marginBottom : 10
  },
  halfLine :{
      height : 15,
      backgroundColor :  'rgba(0,0,0,0.3)',
      width : "50%",
      marginBottom : 10
  }
});
const ProfileSkelton = props => {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt={"no-img"} className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
            <div className={classes.handle} />
            <hr />
            <div className={classes.fulLine} />
            <div className={classes.halfLine} />
            <hr />
            <LocationOn color="primary" />
            <span>Location</span>
            <hr />
            <LinkIcon color="primary"/>
            <span>website</span>
            <hr />
            <CalendarToday color="primary"/>
            <span> Joined Aug 2019</span>
        </div>
      </div>
    </Paper>
  );
};
ProfileSkelton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkelton);
