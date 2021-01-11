import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GameCard from "./GameCard"
import Container from "react-bootstrap/Container";
import Nav from './Nav';
import requireAuth from "./requireAuth"

class GameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gamesColum1: [],
            gamesColum2: [],
            gamesColum3: [],
            steamid: '',
            friends: ''
        }
    }
    

    componentDidMount() {
        // fetch('https://stageapi.steampals.io/posts')
        // .then(res => res.json())
        // .then((data) => {
        console.log(this.props.location.state.games)
        if (this.props.location.state.games){
            let loop = 1,
                gamesColum1 = [],
                gamesColum2 = [],
                gamesColum3 = []
            for (let game of this.props.location.state.games){

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
        }
        let friends = []
        console.log(this.props.location.state.friends)
        for (let friend of this.props.location.state.friends){
            friends.push(friend.name)
        }
        friends = friends.join()
        this.setState({friends: friends})
        // })
        // .catch(console.log)
    }

    render() {
        return(
            <Container>
                <Nav name={this.props.name} />
                <div>
                    <h1 className="compGameText">Comparing with: {this.state.friends}</h1>
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
            </Container>
        );
    }
}


export default requireAuth(GameScreen);