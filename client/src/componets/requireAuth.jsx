import React, { Component } from 'react';
import {Redirect, withRouter} from "react-router-dom";

export default (ChildComponent) => {
    class ComposedComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                auth: false,
                redirect: false,
                name: ""
            }
        }
        // fires immediately after the initial render
        componentDidMount() {
            console.log("componentDidMount()");
            fetch('https://api.steampals.io/auth/isloggedin', {credentials: 'include'})
            .then(res => res.json())
            .then((data) => {
                console.log(data.isloggedin)
                if (data.isloggedin === "True"){
                    console.log("Returning True")
                    console.log(data.name)
                    this.setState({auth: true, name: data.name})
                }
                else {
                    console.log("Returning False")
                    this.setState({redirect: true})
                }
                this.shouldNavigateAway();
            })
            .catch(console.log)
        };

        shouldNavigateAway() {
            console.log("shouldNavigateAway() called")
            if(this.state.auth !== true){
                console.log("Redirecting...");
            };
        };

        render() {
            if(this.state.auth === true){
                return <ChildComponent {...this.props} name={this.state.name} />
            }
            if(this.state.redirect){
                return <Redirect to={{pathname: "/login"}} />
            }
            return null
        };
    };

    return(withRouter(ComposedComponent));
};
