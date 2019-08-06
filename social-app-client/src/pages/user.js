import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/screams/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import ScreamSkelton from '../util/ScreamSkelton';
import ProfileSkelton from '../util/ProfileSkelton';

//Mui staff
import Grid from '@material-ui/core/Grid';


//Redux
import {connect} from 'react-redux';
import {getUserData} from '../redux/actions/dataActions'


 class user extends Component {

    state= {
        profile : null,
        screamIdParam : null
    }
    componentDidMount(){
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;
        if(screamId) this.setState({
            screamIdParam : screamId
        })
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
        .then(res=>{
            this.setState({
                profile : res.data.user
            })
        })
        .catch(err => console.log(err))
    }
    render() {
        const {screams , loading} = this.props.data;
        const {screamIdParam} = this.state;
        const screamsMarkup  =loading ? (
            <ScreamSkelton />
        ): screams === null ? (
            <p>No screams from this user</p>
        ): ! screamIdParam ?(
            screams.map(scream=> <Scream key={scream.screamId}  scream={scream} />)
        ):
        (
            screams.map(scream=>{
                if(scream.screamId !== screamIdParam)
                return <Scream key={scream.screamId}  scream={scream}  />
                else return <Scream key={scream.screamId}  scream={scream} openDialog />

            })
        )

        return (
            <Grid container spacing={10}>
        <Grid item xs={12} sm={8}>
         {screamsMarkup}
        </Grid>

        <Grid item xs={12} sm={4}>
         {
             this.state.profile === null ? <ProfileSkelton />
             :
             <StaticProfile profile={this.state.profile} />
         }
        </Grid>
      </Grid>
        )
    }
}
user.propTypes = {
    data : PropTypes.object.isRequired,
    getUserData : PropTypes.func.isRequired
}
const mapActionsToProps = dispatch=>({
getUserData : (handle)=>dispatch(getUserData(handle))
})
const mapStateToProps = state =>({
data : state.data
})
export default connect(mapStateToProps,mapActionsToProps)(user)
