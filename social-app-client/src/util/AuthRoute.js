import React from 'react'
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

import {connect}  from 'react-redux';
const AuthRoute = ({component: Component,authenticated,...rest}) => (
    <Route
    {...rest}
    render={(props)=>authenticated === true ? <Redirect to="/" /> : <Component {...props} />}
    />

);

const mapStateToProps = (state) =>{
    return {
        authenticated : state.user.authenticated
    }
}

AuthRoute.propTypes = {
    authenticated : PropTypes.bool
}
export default connect(mapStateToProps)(AuthRoute)
