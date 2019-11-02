import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import ProfileCard from './componets/ProfileCard';
import Nav from './componets/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './index.css'

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.items = this.state.cart.map((item, key) =>
            <li key={item.id}>{item.name}</li>
        );
      }

    render(){
        return (
            <div>
                {this.items}
            </div>
        )
    }
}


// TODO make friends nav component

const App = () => (
    <Container>
        <Nav />
        <Board />
        <Row>
            <Col md={4}>
                <h2 className="friendsNav">Select Your friends</h2>
            </Col>
            <Col md={4}>
                <Form.Control type="email" placeholder="Search..." />
            </Col>
            <Col md={4}>
                <div>
                    <Button variant="success" className="d-block w-100 ml-auto">Compare with Friends!</Button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md={4} style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/48/48fdc52e37e59e0c8352d069aef3ac24f6586b0f_medium.jpg" name="Toxic Laughter" status="Online" type="online" />
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0d/0db8ba11140bc3123cff7176121949aec93d5617_medium.jpg" name="antonio" status="Call of Duty" type="inGame" />
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9d/9db9a42b946084eb4446a94ec0342f163dff6f0e_medium.jpg" name="imfearless" status="Away" type="away" />
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/48/48fdc52e37e59e0c8352d069aef3ac24f6586b0f_medium.jpg" name="Toxic Laughter" status="Online" type="online" />
            </Col>
            <Col md={4 } style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0d/0db8ba11140bc3123cff7176121949aec93d5617_medium.jpg" name="antonio" status="Call of Duty" type="inGame" />
            </Col>
            <Col md={4} style={{marginTop: '20px'}}>
                <ProfileCard pic="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9d/9db9a42b946084eb4446a94ec0342f163dff6f0e_medium.jpg" name="imfearless" status="Away" type="away" />
            </Col>
        </Row>
    </Container>
  );


// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
