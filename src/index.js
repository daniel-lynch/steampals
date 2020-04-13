import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProfileCard from './componets/ProfileCard';
import Nav from './componets/Nav';
import Button from 'react-bootstrap/Button';
import SearchBar from './componets/SearchBar';
import GameCard from "./componets/GameCard"
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
            gamesColum1: [],
            gamesColum2: [],
            gamesColum3: []
        }
    }
    

    componentDidMount() {
        fetch('https://stageapi.steampals.io/posts')
        .then(res => res.json())
        .then((data) => {
          let loop = 1,
              gamesColum1 = [],
              gamesColum2 = [],
              gamesColum3 = []
          for (let game of data){

            switch(loop){
                case 1:
                    gamesColum1.push(game);
                    break;
                case 2:
                    gamesColum2.push(game);
                    break;
                case 3:
                    gamesColum3.push(game);
                    break;
                default:
                    break;
            }

            loop += 1;

            if (loop === 4){
                loop = 1;
            }

          }
          this.setState({
              gamesColum1: gamesColum1,
              gamesColum2: gamesColum2,
              gamesColum3: gamesColum3
             })
        })
        .catch(console.log)
    }

    render() {
        return(
            <div>
                <h1 className="compGameText">Comparing with: Sharpyaddict</h1>
                <Row>
                    <Col md={6} lg={4}>
                        {this.state.gamesColum1.map(function(card){
                            return <GameCard {...card} key={card.name} />;
                        })}
                    </Col>
                    <Col md={6} lg={4}>
                        {this.state.gamesColum2.map(function(card){
                            return <GameCard {...card} key={card.name} />;
                        })}
                    </Col>
                    <Col md={6} lg={4}>
                        {this.state.gamesColum3.map(function(card){
                            return <GameCard {...card} key={card.name} />;
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
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
