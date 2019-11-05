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
            filterText: '',
            friends : [
                {
                    id: 1, 
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/48/48fdc52e37e59e0c8352d069aef3ac24f6586b0f_medium.jpg",
                    name: "Toxic Laughter",
                    status: "Online",
                    type: "online"
                },
                {
                    id: 2,
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0d/0db8ba11140bc3123cff7176121949aec93d5617_medium.jpg",
                    name: "antonio",
                    status: "Call of Duty",
                    type: "inGame",
                },
                {
                    id:3,
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9d/9db9a42b946084eb4446a94ec0342f163dff6f0e_medium.jpg",
                    name: "imfearless",
                    status: "Away",
                    type: "away"
                },
                {
                    id: 4, 
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/48/48fdc52e37e59e0c8352d069aef3ac24f6586b0f_medium.jpg",
                    name: "Toxic Laughter",
                    status: "Online",
                    type: "online"
                },
                {
                    id: 5,
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0d/0db8ba11140bc3123cff7176121949aec93d5617_medium.jpg",
                    name: "antonio",
                    status: "Call of Duty",
                    type: "inGame",
                },
                {
                    id: 6,
                    pic: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9d/9db9a42b946084eb4446a94ec0342f163dff6f0e_medium.jpg",
                    name: "imfearless",
                    status: "Away",
                    type: "away"
                },
            ]
        }

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);

      }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    render(){
        const filterText = this.state.filterText.toLowerCase();
        const rows = [];

        this.state.friends.forEach((friend) => {
            if (friend.name.toLowerCase().indexOf(filterText) === -1){
                console.log(filterText)
                return;
            }
            rows.push(<ProfileCard pic={friend.pic} name={friend.name} status={friend.status} type={friend.type} key={friend.id} />)
        })

        return (
            <Row>
                <Col md={4}>
                    <h2 className="friendsNav">Select Your friends</h2>
                </Col>
                <Col md={4}>
                    <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} />
                </Col>
                <Col md={4}>
                    <Button variant="success" className="w-100">Compare with Friends!</Button>
                </Col>
                {rows}
            </Row>
        )
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      }

      handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
      }

      render() {
        return (
        <Form.Control
            type="text"
            placeholder="Search..."
            value={this.props.filterText}
            onChange={this.handleFilterTextChange} />
        );
    }
}


// TODO make friends nav component

const App = () => (
    <Container>
        <Nav />
        <Board />
    </Container>
  );


// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
