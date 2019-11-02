import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Navbar from "react-bootstrap/Navbar";
import '../index.css';


class Navigation extends Component {
    render(){
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>SteamPals.io</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="active" href="/compare">Compare</Nav.Link>
                        <Nav.Link href="/github">Github</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title="ProfileName" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/auth/logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation