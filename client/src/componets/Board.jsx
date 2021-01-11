import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProfileCard from './ProfileCard';
import Button from 'react-bootstrap/Button';
import SearchBar from './SearchBar';
import '../index.css';
import Nav from './Nav';
import requireAuth from "./requireAuth"
import placeholder from "../images/64.png"

class Board extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            filterText: '',
            friends : [],
            selectedFriends: []
        }

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
        this.handleCompare = this.handleCompare.bind(this)

      }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    handleFriendSelect(id) {
        let selectedFriends = this.state.selectedFriends
        if (selectedFriends.indexOf(id) !== -1){
            console.log(selectedFriends.indexOf(id))
            selectedFriends.splice(selectedFriends.indexOf(id), 1)
            this.setState({
                selectedFriends: selectedFriends
            });
        }
        else {
            this.setState({
                selectedFriends: [...selectedFriends, id]
            });
        }
    }

    handleCompare() {

        let friends = []
        let games = []
        let selectedFriends = this.state.selectedFriends

        for (let friend of selectedFriends){
            friends.push(this.state.friends[friend -1])
        }

        fetch('http://api.steampals.io/api/v1/comparegames', {method: 'POST', credentials: 'include', body: JSON.stringify(friends), headers: {'Content-Type': 'application/json'}})
        .then(res => res.json())
        .then((data) => {
            games = data
            this.props.history.push({
                pathname: '/gamescreen',
                state: {games: games, friends: friends}
              })
        });

    }

    componentDidMount() {
        fetch('http://api.steampals.io/api/v1/getfriends', {credentials: 'include'})
        .then(res => res.json())
        .then((data) => {
            console.log(data)
            this.setState({friends: data})
        })
    }

    render(){
        const filterText = this.state.filterText.toLowerCase();
        const selectedFriends = this.state.selectedFriends;
        let rows = [];

        if (this.state.friends.length > 1) {
            rows = []
            this.state.friends.forEach((friend) => {
                if (friend.name.toLowerCase().indexOf(filterText) === -1){
                    // Text box debug
                    // console.log(filterText)
                    return;
                }
    
                let options = {
                    pic: friend.pic,
                    name: friend.name,
                    status: friend.status,
                    type: friend.type,
                    key: friend.id,
                    card: "friendsCard"
                }
    
                if (selectedFriends.indexOf(friend.id) !== -1){
                    options.card += " friendSelected"
                }
                else {
                    options.card = "friendsCard"
                }
    
                // console.log(friend.id, selectedFriends)
                // console.log(friend.id in selectedFriends)
                rows.push(<ProfileCard options={options} key={friend.id} onhandleFriendSelect={this.handleFriendSelect} />)
            })
        }
        else {
            console.log("else")

            let options = {
                pic: placeholder,
                name: " ",
                status: "",
                type: "",
                key: "",
                card: "friendsCard"
            }

            for (let i=0; i < 40; i++){
                rows.push(<ProfileCard options={options} key={i}/>)
            }

        }


        return (
            <Container>
                <Nav name={this.props.name} />
                <Row>
                    <Col md={4}>
                        <h2 className="friendsNav">Select Your friends</h2>
                    </Col>
                    <Col md={4}>
                        <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} />
                    </Col>
                    <Col md={4}>
                    {/* <Link to="/gamescreen"><Button onClick={this.handleCompare} variant="success" className="w-100">Compare with Friends!</Button></Link> */}
                    <Button onClick={this.handleCompare} variant="success" className="w-100">Compare with Friends!</Button>
                    </Col>
                    {rows}
                </Row>
            </Container>
        )
    }
}

export default requireAuth(Board);