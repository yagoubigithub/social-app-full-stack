import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";


import Scream from '../components/Scream';
import Profile from '../components/Profile';
class home extends Component {
  state = {
    screams: null
  };
  componentDidMount() {
    axios
      .get("/screams")
      .then(res => {
        this.setState({
          screams: res.data
        });
      })
      .catch(error => console.log(error));
  }
  render() {

      let recentScreamMarkup = this.state.screams ? 
      this.state.screams.map(scream=> <Scream key={scream.screamId}  scream={scream} />) : 
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

export default home;
