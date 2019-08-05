import React, { Component } from "react";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";


import Scream from '../components/screams/Scream';
import Profile from '../components/profile/Profile';

//Redux 
import {connect } from 'react-redux';
import {getScreams} from '../redux/actions/dataActions'

class home extends Component {
  
  componentDidMount() {
   this.props
   .getScreams();
  }
  render() {
    const {screams , loading} = this.props.data;

      let recentScreamMarkup =  !loading ? 
      screams.map(scream=> <Scream key={scream.screamId}  scream={scream} />) : 
      <p>Loading ...</p>

    return (
      <Grid container spacing={10}>
        <Grid item xs={12} sm={8}>
         {recentScreamMarkup}
        </Grid>

        <Grid item xs={12} sm={4}>
         <Profile />
        </Grid>
      </Grid>
    );
  }
}
home.propTypes = {
  getScreams : PropTypes.func.isRequired,
  data : PropTypes.object.isRequired
}
const mapActionsToProps = dispatch =>({
  getScreams :()=> dispatch(getScreams())
})
const mapStateTopProps = state =>({
data : state.data
})
export default connect(mapStateTopProps,mapActionsToProps)( home ) ;
