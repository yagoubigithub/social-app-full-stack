import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import MyButton from '../../util/MyButton';

//icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

//Mui staff
import Buttton from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

//redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../redux/actions/userActions";

const styles = theme => {
  theme.spreadThis["button"] = {
    float: "right"
  };
  return {
    ...theme.spreadThis
  };
};
class Profile extends Component {
  handleLogOut = () => {
    this.props.logoutUser();
  };

  handleImageChange = event => {
    const image = event.target.files[0];

    //send to the server

    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated
      }
    } = this.props;
    const profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt={handle} className="profile-image" />
              <input
                type="file"
                hidden="hidden"
                id="imageInput"
                onChange={this.handleImageChange}
              />
              <MyButton
                tip="Edit profile picture"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <EditIcon color="primary" />
              </MyButton>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5"
              >
                @{handle}
              </MuiLink>
              <hr />

              {bio && <Typography variant="body2">{bio}</Typography>}

              <hr />
              {location && (
                <React.Fragment>
                  <LocationOn color="primary" />
                  <span>{location}</span>
                </React.Fragment>
              )}
              <hr />
              {website && (
                <React.Fragment>
                  <LinkIcon color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                </React.Fragment>
              )}
              <hr />
              <CalendarToday color="primary" />
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
              <hr />
            </div>
            <MyButton tip="Logout" onClick={this.handleLogOut}>
              <KeyboardReturn color="primary" />
            </MyButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            no profile found please login again
            <span className={classes.button}>
              <Buttton
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                login
              </Buttton>
              <Buttton
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
              >
                Sign up
              </Buttton>
            </span>
          </Typography>
        </Paper>
      )
    ) : (
      <p>loading...</p>
    );
    return profileMarkup;
  }
}
Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapActionsToProps = dispatch => {
  return {
    logoutUser: () => dispatch(logoutUser()),
    uploadImage: formData => dispatch(uploadImage(formData))
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
