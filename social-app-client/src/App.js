import React, { Component } from "react";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import themeObject from './util/theme'
import jwtDecode from 'jwt-decode';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import axios from 'axios';

//Redux
import {Provider} from 'react-redux';
import store from './redux/store';
import {SET_AUTHENTICATED} from './redux/types'
import {logoutUser, getUserData} from './redux/actions/userActions'
//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signUp";

//Compoenentt
import Navbar from "./components/Navbar";
import AuthRoute from './util/AuthRoute'

const theme = createMuiTheme(themeObject)

let authenticated;
const token  = localStorage.FBIdToken;

if(token){

  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login';
    
  }else{
    store.dispatch({type: SET_AUTHENTICATED});
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}
console.log(authenticated)

class App extends Component  {

  render(){
    return (
     <MuiThemeProvider  theme={theme}>
     <Provider store={store}>
     <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute  path="/login" component={login}  />
              <AuthRoute  path="/signup" component={signup}  />
            </Switch>
          </div>
        </Router>
      </div>
     </Provider>
      
     </MuiThemeProvider>
    );
  }
 
}

export default App;
