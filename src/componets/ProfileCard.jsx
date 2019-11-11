import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import '../index.css';


class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
      }

      handleFriendSelect(e) {
        this.props.onhandleFriendSelect(this.props.options.key);
      }

    render(){
        let {pic, type, name, status, card} = this.props.options;
        return (
            <Col md={4} style={{marginTop: '20px'}}>
                <Card className={card} onClick={this.handleFriendSelect}>
                    <Card.Body>
                        <Row>
                            <Col xs="auto"><img alt="" src={pic} /></Col>
                            <Col xs="auto">
                                <p className={`${type} friendName`}>{name}</p>
                                <p className={type}>{status}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

export default ProfileCard