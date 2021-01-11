import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./componets/Login"
import GameScreen from './componets/GameScreen'
import Board from './componets/Board.jsx'
import './index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/compare">
                    <Board />
                </Route>
                <Route path="/gamescreen">
                    <GameScreen />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/">
                    <Redirect to={{
                        pathname: "/compare"
                        }} 
                    />
                </Route>
            </Switch>
        </Router>
    )
};

// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
