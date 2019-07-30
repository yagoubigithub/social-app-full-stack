import React, { Component } from "react";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import themeObject from './util/theme'
import jwtDecode from 'jwt-decode';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

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

  const decodeToken  = jwtDecode(token);
  console.log(decodeToken)
  if(decodeToken.exp * 1000 < Date.now()){
    window.location.href = '/login';
    authenticated = false;
  }else{
    authenticated= true;
  }
}


class App extends Component  {

  render(){
    return (
     <MuiThemeProvider  theme={theme}>
        <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute  path="/login" component={login} authenticated={authenticated} />
              <AuthRoute  path="/signup" component={signup}  authenticated={authenticated}/>
            </Switch>
          </div>
        </Router>
      </div>
     </MuiThemeProvider>
    );
  }
 
}

export default App;
