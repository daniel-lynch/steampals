import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProfileCard from './componets/ProfileCard';
import Nav from './componets/Nav';
import Button from 'react-bootstrap/Button';
import SearchBar from './componets/SearchBar';
import Collapse from 'react-bootstrap/Collapse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './index.css';

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
                    id: 3,
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
            ],
            selectedFriends: []
        }

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleFriendSelect = this.handleFriendSelect.bind(this);

      }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    handleFriendSelect(id) {
        let selectedFriends = this.state.selectedFriends
        console.log(selectedFriends)
        if (selectedFriends.indexOf(id) !== -1){
            console.log(selectedFriends.indexOf(id))
            selectedFriends.splice(selectedFriends.indexOf(id), 1)
            console.log(selectedFriends)
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

    render(){
        const filterText = this.state.filterText.toLowerCase();
        const selectedFriends = this.state.selectedFriends;
        const rows = [];

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

class GameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        }
    }
    

    componentDidMount() {
        fetch('https://stageapi.steampals.io/posts')
        .then(res => res.json())
        .then((data) => {
          console.log(data)
          this.setState({ contacts: data })
        })
        .catch(console.log)
    }

    render() {
        return(
            <div>
                {/* {this.state.contacts} */}
                <ul>
                    {this.state.contacts.map(function(listValue){
                        return <li>{listValue.name}</li>;
                    })}
                </ul>
                <h1 className="compGameText">Comparing with: Sharpyaddict</h1>
                <Row>
                    <Col md={6} lg={4}>
                        <GameCard name={"Arma 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/107410/header.jpg"} info={"Some info here"} />
                        <GameCard name={"Call of Duty Black Ops 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/311210/header.jpg"} info={"Some info here"} />
                        <GameCard name={"Payday 2"} image={"https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg"} info={"Some info here"} />
                    </Col>
                    <Col md={6} lg={4}>
                        <GameCard name={"Call of Duty Black Ops 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/311210/header.jpg"} info={["Call of Duty\u00ae: Black Ops III Zombies Chronicles Edition includes the full base game plus the Zombies Chronicles content expansion.", <br />, "Genre: Action", <br />, "Multiplayer: Yes", <br />, <Button className={"steamTags"}>Multiplayer</Button>, <Button className={"steamTags"}>FPS</Button>, <Button className={"steamTags"}>Zombies</Button>, <br />, <a href="https://store.steampowered.com/app/311210/">Store Link</a>]} />
                        <GameCard name={"Payday 2"} image={"https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg"} info={"Some info here"} />
                        <GameCard name={"Arma 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/107410/header.jpg"} info={"Some info here"} />
                    </Col>
                    <Col md={6} lg={4}>
                        <GameCard name={"Payday 2"} image={"https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg"} info={"Some info here"} />
                        <GameCard name={"Arma 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/107410/header.jpg"} info={"Some info here"} />
                        <GameCard name={"Call of Duty Black Ops 3"} image={"https://steamcdn-a.akamaihd.net/steam/apps/311210/header.jpg"} info={"Some info here"} />
                    </Col>
                </Row>
            </div>
        );
    }
}

function GameCard(props) {
    const [open, setOpen] = useState(false);
    return(
        <Col md={12} lg={12} className="p-0 mb-4" onClick={() => setOpen(!open)}>
            <div className="position-relative">
                <img className="w-100 h-auto gameCard" alt={props.name} src={props.image} />
                <div class="middleTop">
                    <div class="text">{props.name}</div>
                </div>
                <div class="middleBottom">
                    <div class="text underline">More Info</div>
                    <div class="text"><FontAwesomeIcon icon={faCaretDown} /></div>
                </div>
            </div>
            <Collapse in={open}>
                <div className="gameInfo">
                    <p className="pl-3 pt-2 pb-3">{props.info}</p>
                </div>
            </Collapse>
        </Col>
    )
}

// const App = () => (
//     <Container>
//         <Nav />
//         <Board />
//     </Container>
//   );

const App = () => (
    <Container>
        <Nav />
        <GameScreen />
    </Container>
);

// ========================================

ReactDOM.render(<App />, document.getElementById('root'));
