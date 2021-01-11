import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Navbar from "react-bootstrap/Navbar";
import '../index.css';
import {
    Link
  } from "react-router-dom";


class Navigation extends Component {
    render(){
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Link to="/compare"><Navbar.Brand>SteamPals.io</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="active" href="/compare">Compare</Nav.Link>
                        <Nav.Link href="https://github.com/daniel-lynch/steampals">Github</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={this.props.name} id="collasible-nav-dropdown">
                            <NavDropdown.Item href="http://api.steampals.io/auth/logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation