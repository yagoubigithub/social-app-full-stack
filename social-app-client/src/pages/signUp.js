import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/icon.png";

import {Link} from 'react-router-dom';

//Mui staff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';

//Reux stuff

import {connect} from 'react-redux';
import {signupUser} from '../redux/actions/userActions';

const styles = (theme) => {
  
    return {
      ...theme.spreadThis
    }
};
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword : "",
      handle :  "",
      loading: false,
      errors: {}
    };
  }
  componentWillReceiveProps = (newProps)=>{
    if(newProps.UI.errors){
      this.setState({errors : newProps.UI.errors})
    }
  }
  handleSubmit = event => {
    event.preventDefault();

    const newuserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword : this.state.confirmPassword,
      handle : this.state.handle
    };
    this.props.signupUser(newuserData,this.props.history);
    
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { classes, UI :{loading} } = this.props;
    const { errors} = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monky image" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Sign Up
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              type="email"
              className={classes.textField}
              name="email"
              label="Email"
              onChange={this.handleChange}
              fullWidth
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
            />

            <TextField
              id="password"
              type="password"
              value={this.state.password}
              className={classes.textField}
              name="password"
              label="Password"
              onChange={this.handleChange}
              fullWidth
              helperText={errors.password}
              error={errors.password ? true : false}
            />
             <TextField
              id="confirmPassword"
              type="password"
              value={this.state.confirmPassword}
              className={classes.textField}
              name="confirmPassword"
              label="Confirm Password"
              onChange={this.handleChange}
              fullWidth
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
            />
            <TextField
              id="handle"
              type="text"
              value={this.state.handle}
              className={classes.textField}
              name="handle"
              label="Handle"
              onChange={this.handleChange}
              fullWidth
              helperText={errors.handle}
              error={errors.handle ? true : false}
            />

            {errors.error  && (
              <Typography variant="body2" className={classes.customeError}>{errors.general}</Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className={classes.button}
              disabled={loading}
            >
              Sign up
              {loading ? (<CircularProgress size={30} className={classes.progress} />) : null}
            </Button>
            <br />
            <small>Already  have an account ? Login <Link to="/login">here</Link></small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}
SignUp.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapActionsToProps = (dispatch)=>{

  return {
    signupUser :  (newUserData,history) => dispatch(signupUser(newUserData,history))
  }
}
const mapStateToProps = (state) =>{
  return {
    UI : state.UI,
  user :  state.user
  }
}

export default connect(mapStateToProps,mapActionsToProps)( withStyles(styles)(SignUp));
