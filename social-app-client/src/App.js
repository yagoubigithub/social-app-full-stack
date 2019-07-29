import React, { Component } from "react";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signUp";
import Navbar from "./components/Navbar";


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#d50000',
      light: "#c33333",
      dark : "#7e0000",
      contrastText : "#fff"
    },
    secondary: {
      main : "#d500f9",
      dark: "#9500ae",
      light : "#dd33fa",
      contrastText : "#fff"
    },
  },
  
})
class App extends Component  {

  render(){
    return (
     <MuiThemeProvider theme={theme}>
        <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/signup" component={signup} />
            </Switch>
          </div>
        </Router>
      </div>
     </MuiThemeProvider>
    );
  }
 
}

export default App;
