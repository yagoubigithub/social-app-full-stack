import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton'

import { connect } from "react-redux";
import { editDetails } from "../../redux/actions/userActions";

//Mui staff

import  Dialog  from "@material-ui/core/Dialog";
import  DialogTitle  from "@material-ui/core/DialogTitle";
import  DialogActions  from "@material-ui/core/DialogActions";
import  DialogContent  from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import  Button  from "@material-ui/core/Button";

//icons
import EditIcon from "@material-ui/icons/Edit";




const styles = theme => ({
  ...theme.spreadThis
});
class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false
  };
  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }
  mapUserDetailsToState = credentials => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : ""
    });
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = () =>{
      const userDetails = {
        bio: this.state.bio,
        website: this.state.website,
        location: this.state.location,
      }
      this.props.editDetails(userDetails)
      this.handleClose();
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
       
        <MyButton tip="edit details" onClick={this.handleOpen} btnClassName={classes.button}>
        <EditIcon color="primary" />
        </MyButton>
        <Dialog 
        open={this.state.open}
        onClose={this.handleClose}
        fullWidth
        maxWidth="sm"

        >
        <DialogTitle>Edit Your Details</DialogTitle>
        <DialogContent >
            <form>
            <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
                />
                <TextField
                name="website"
                type="text"
                label="Website"
                
                placeholder="Your Website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
                />
                <TextField
                name="location"
                type="text"
                label="Location"
            
                placeholder="your location "
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
                />


            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
                Save
            </Button>
        </DialogActions>

        </Dialog>
      </Fragment>
    );
  }
}
EditDetails.propTypes = {
  editDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};
const mapActionsToProps = dispatch => ({
  editDetails: userDetails => dispatch(editDetails(userDetails))
});

const mapStateToProps = state => ({
  credentials: state.user.credentials
});
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
