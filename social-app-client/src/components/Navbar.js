import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import MyButton from '../util/MyButton'
import { Link } from "react-router-dom/";

//Mui staff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

//redux
import { connect } from "react-redux";

// Icons
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add'
import NotificationsIcon  from '@material-ui/icons/Notifications';




class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar position="fixed" color="primary">
        <Toolbar className="nav-container">
          {authenticated ? (
              <Fragment>
                  <MyButton tip="add Scream">
                      <AddIcon  />
                  </MyButton>
                  <Link to="/">
                  <MyButton tip="Home">
                      <HomeIcon  />
                  </MyButton>
                  </Link>
                  
                  <MyButton tip="Notifications">
                      <NotificationsIcon  />
                  </MyButton>
              </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
