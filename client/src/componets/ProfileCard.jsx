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
            <Col md={6} lg={4} style={{marginTop: '20px'}}>
                <Card className={card} onClick={this.handleFriendSelect}>
                    <Card.Body>
                        <Row>
                            <Col xs="2" md="3" lg="3"><img alt="" src={pic} /></Col>
                            <Col className={`friendStatus`} xs="10" md="9" lg="9">
                                <p className={`${type} friendName`}>{name}</p>
                                <p className={`${type} friendStatus`}>{status}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

export default ProfileCard