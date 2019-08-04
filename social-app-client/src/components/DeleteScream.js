import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

//Mui staff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

//icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";

//redux
import { connect } from "react-redux";
import { deleteScream } from "../redux/actions/dataActions";

const styles ={
    deleteButton :{
        position : 'absolute',
        left :  '90%',
        top : '1%'
    }
};
class DeleteScream extends Component {
    state= {
        open : false,
    }
    handleOpen = () =>{
        this.setState({open: true})
    }
    handleClose = () =>{
        this.setState({open: false})
    }
    deleteScream = () =>{
        this.props.deleteScream(this.props.screamId)
        this.setState({open: false})
    }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete Scream"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog 
        open={this.state.open}
        fullWidth
        maxWidth="sm"
        >
            <DialogTitle>
                Are you sure you want to deletee this scream?
            </DialogTitle>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.deleteScream} color="secondary" variant="contained">
                    delete
                </Button>
            </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};
const mapActionsToProps = dispatch => ({
  deleteScream: screamId => dispatch(deleteScream(screamId))
});
export default connect(
  null,
  mapActionsToProps
)(withStyles(styles)(DeleteScream));
