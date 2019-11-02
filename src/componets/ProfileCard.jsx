import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import '../index.css';


class ProfileCard extends Component {
    render(){
        return (
            <Card style={{ width: '22rem' }}>
                <Card.Body className="friendsCard">
                    <Row>
                        <Col xs="auto"><img alt="" src={this.props.pic} /></Col>
                        <Col xs="auto">
                            <p className={this.props.type + "Name"}>{this.props.name}</p>
                            <p className={this.props.type}>{this.props.status}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}

export default ProfileCard