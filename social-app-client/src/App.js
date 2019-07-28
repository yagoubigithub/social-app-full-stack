import React from 'react';

import {Switch, Route,BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signUp';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
    <Navbar />
    <Router>
      <Switch>
        <Route exact path='/' component={home} />
        <Route exact path='/login' component={login} />
        <Route exact path='/signup' component={signup} />
      </Switch>
    </Router>
     
    </div>
  );
}

export default App;
